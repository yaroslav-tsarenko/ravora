import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getSessionUser } from "@/lib/auth";
import { resolveDiscount } from "@/lib/discounts";
import { spoynt } from "@/lib/payment/spoynt";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const body = await request.json();
    const validated = checkoutSchema.parse(body);
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!validated.contact.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number; variantName?: string }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        variantName: item.variantName || null,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    const discount = await resolveDiscount({
      userId: user?.id ?? null,
      email: validated.contact.email,
      code: validated.discountCode ?? null,
    });

    const discountAmount = discount ? +(subtotal * (discount.percent / 100)).toFixed(2) : 0;
    const discountedSubtotal = subtotal - discountAmount;

    const taxRate = 21;
    // Prices are VAT-inclusive: derive the tax already contained in the price
    // rather than adding it on top of the total.
    const taxAmount = +(discountedSubtotal - discountedSubtotal / (1 + taxRate / 100)).toFixed(2);
    const shippingCost = discountedSubtotal >= 100 ? 0 : 5.99;
    const total = +(discountedSubtotal + shippingCost).toFixed(2);

    const storeSettings = await prisma.storeSettings.findFirst();
    const currency = storeSettings?.currency || "GBP";

    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        customerName: `${validated.shipping.firstName} ${validated.shipping.lastName}`,
        customerEmail: validated.contact.email,
        customerPhone: validated.contact.phone,
        shippingAddress: validated.shipping,
        shippingMethod: validated.shippingMethod,
        shippingCost,
        subtotal,
        taxAmount,
        discountAmount,
        discountCode: discount?.code ?? null,
        discountPercent: discount?.percent ?? null,
        total,
        paymentMethod: "spoynt",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const locale = body.locale || "en";
    const invoice = await spoynt.createPaymentInvoice({
      orderId: order.id,
      amount: total,
      currency,
      email: validated.contact.email,
      locale,
      customerData: {
        firstName: validated.shipping.firstName,
        lastName: validated.shipping.lastName,
        phone: validated.contact.phone || undefined,
        address1: validated.shipping.address1,
        address2: validated.shipping.address2,
        city: validated.shipping.city,
        postCode: validated.shipping.postalCode,
        country: validated.shipping.country,
        region: validated.shipping.province,
      }
    });

    // Save the Spoynt cpi (payment invoice ID) to the order
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: invoice.data.id },
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: invoice.data.attributes.hpp_url,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

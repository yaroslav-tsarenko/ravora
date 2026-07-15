import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { spoynt } from "@/lib/payment/spoynt";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { resolveDiscount, markDiscountUsed } from "@/lib/discounts";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { sendOrderToHub } from "@/lib/hub";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = 
      request.headers.get("x-signature") || 
      request.headers.get("spoynt-signature") || 
      request.headers.get("signature");

    console.log(`[Spoynt Callback] Received callback. Signature header: ${signature}`);
    console.log("[Spoynt Callback] Full webhook raw body payload:", rawBody);

    // Verify signature
    const isValid = spoynt.verifyCallbackSignature(rawBody, signature);
    if (!isValid) {
      console.error("[Spoynt Callback] Signature verification failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // IP Whitelisting (only enforced in real/production mode)
    if (!spoynt.isMockMode()) {
      const allowedIps = ["3.126.246.226", "3.127.19.165", "3.126.219.223"];
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (request.headers.get("x-real-ip") || "");
      
      if (!allowedIps.includes(ip)) {
        console.warn(`[Spoynt Callback] Blocked callback attempt from unauthorized IP: ${ip}`);
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
      }
      console.log(`[Spoynt Callback] IP verified: ${ip}`);
    }

    const payload = JSON.parse(rawBody);
    const invoiceId = payload.data?.id;
    const attributes = payload.data?.attributes;
    const referenceId = attributes?.reference_id;
    const status = attributes?.status?.toLowerCase();

    if (!referenceId) {
      console.error("[Spoynt Callback] Missing reference_id in payload.");
      return NextResponse.json({ error: "Missing reference_id" }, { status: 400 });
    }

    // Reference ID is formatted as "orderId-timestamp" (e.g. "cpi_abc123-16278888")
    // Split by hyphen to retrieve the actual Order ID
    const orderId = referenceId.split("-")[0];

    // Fetch the order from DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`[Spoynt Callback] Order ${orderId} (Ref: ${referenceId}) not found in database.`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(`[Spoynt Callback] Processing status update "${status}" for order ${order.orderNumber} (ID: ${order.id})`);

    // Check if order is already processed
    if (order.paymentStatus === PaymentStatus.PAID) {
      console.log(`[Spoynt Callback] Order ${orderId} is already paid. Skipping processing.`);
      return NextResponse.json({ received: true, skipped: true });
    }

    // Map Spoynt statuses to local Order/Payment statuses
    const isSuccess = status === "processed";
    const isFailure = status === "process_failed";
    const isRefund = status === "refunded";

    if (isSuccess) {
      // 1. Update order status to paid and confirmed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          paymentId: invoiceId || order.paymentId,
        },
      });

      // 2. Decrement product stock
      for (const item of order.items) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
          console.log(`[Spoynt Callback] Decremented stock for product ${item.productId} by ${item.quantity}`);
        } catch (stockError) {
          console.error(`[Spoynt Callback] Failed to decrement stock for product ${item.productId}:`, stockError);
        }
      }

      // 3. Mark discount code as used if applicable
      if (order.discountCode) {
        try {
          const discount = await resolveDiscount({
            userId: order.userId,
            email: order.customerEmail,
            code: order.discountCode,
          });
          if (discount) {
            await markDiscountUsed(discount, order.userId);
            console.log(`[Spoynt Callback] Marked discount code "${order.discountCode}" as used.`);
          }
        } catch (discountError) {
          console.error("[Spoynt Callback] Error marking discount as used:", discountError);
        }
      }

      // 4. Send customer notification emails (Confirmation + Invoice)
      const emailPayload = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map(item => ({
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.total),
        })),
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        shippingCost: Number(order.shippingCost),
        discountAmount: Number(order.discountAmount),
        total: Number(order.total),
        shippingMethod: order.shippingMethod || "standard",
        shippingAddress: order.shippingAddress ? (order.shippingAddress as any) : undefined,
        createdAt: order.createdAt,
      };

      console.log(`[Spoynt Callback] Scheduling order emails for #${order.orderNumber}`);
      scheduleEmail(`order confirmation ${order.orderNumber}`, () => sendOrderConfirmationEmail(emailPayload));
      scheduleEmail(`order invoice ${order.orderNumber}`, () => sendOrderInvoiceEmail(emailPayload));

      // 5. Send order details to Hub
      try {
        await sendOrderToHub(order.id);
      } catch (hubError) {
        console.error("[Spoynt Callback] Error sending order to Hub:", hubError);
      }

    } else if (isFailure) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.CANCELLED,
        },
      });
      console.log(`[Spoynt Callback] Order #${order.orderNumber} marked as FAILED/CANCELLED.`);

    } else if (isRefund) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.REFUNDED,
          status: OrderStatus.REFUNDED,
        },
      });
      console.log(`[Spoynt Callback] Order #${order.orderNumber} marked as REFUNDED.`);
    } else {
      console.log(`[Spoynt Callback] Unhandled status update: "${status}"`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Spoynt Callback] Webhook execution error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

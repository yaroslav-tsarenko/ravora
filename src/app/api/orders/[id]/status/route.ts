import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
  ]),
  trackingNumber: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = statusSchema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: validated.status,
        trackingNumber: validated.trackingNumber,
        paymentStatus:
          validated.status === "CANCELLED" || validated.status === "REFUNDED"
            ? "REFUNDED"
            : undefined,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

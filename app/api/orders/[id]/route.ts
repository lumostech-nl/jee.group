import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  total: z.number().optional(),
  description: z.string().optional(),
});

// GET /api/orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user can access this order
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = orderUpdateSchema.parse(body);

    const order = await prisma.order.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Send order status update email and notification
    if (validatedData.status) {
      const { sendEmail, emailTemplates } = await import("@/lib/email");
      const { createOrderNotification } = await import("@/lib/notifications");

      // Send email
      await sendEmail({
        to: order.user.email!,
        subject: emailTemplates.orderStatusUpdate(
          order,
          order.user,
          validatedData.status
        ).subject,
        html: emailTemplates.orderStatusUpdate(
          order,
          order.user,
          validatedData.status
        ).html,
      });

      // Create notification
      await createOrderNotification(
        order.id,
        order.userId,
        validatedData.status
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

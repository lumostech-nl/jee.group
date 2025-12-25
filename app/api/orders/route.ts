import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddress: z.string().min(1),
});

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const statusParam = searchParams.get("status");

    // Validate status parameter
    const status =
      statusParam &&
      Object.values(OrderStatus).includes(statusParam as OrderStatus)
        ? (statusParam as OrderStatus)
        : undefined;

    const where =
      session.user.role === "ADMIN"
        ? status
          ? { status }
          : {}
        : status
        ? { userId: session.user.id, status }
        : { userId: session.user.id };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    // Get products and calculate total
    const products = await prisma.product.findMany({
      where: {
        id: { in: validatedData.items.map((item) => item.productId) },
        isActive: true,
      },
    });

    if (products.length !== validatedData.items.length) {
      return NextResponse.json(
        { error: "Some products not found or inactive" },
        { status: 400 }
      );
    }

    // Check for existing pending orders for the same products
    const existingOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        orderItems: {
          some: {
            productId: {
              in: validatedData.items.map((item) => item.productId),
            },
          },
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check if any of the products are already in pending orders
    const duplicateProducts = [];
    for (const existingOrder of existingOrders) {
      for (const existingItem of existingOrder.orderItems) {
        for (const newItem of validatedData.items) {
          if (existingItem.productId === newItem.productId) {
            duplicateProducts.push(existingItem.product.name);
          }
        }
      }
    }

    if (duplicateProducts.length > 0) {
      return NextResponse.json(
        {
          error: "Duplicate order detected",
          message: `شما قبلاً سفارش فعالی برای این سرویس‌ها دارید: ${duplicateProducts.join(
            ", "
          )}. لطفاً تا تکمیل سفارش قبلی صبر کنید.`,
          duplicateProducts,
        },
        { status: 409 }
      );
    }

    // For service-based products, we don't check stock or calculate price
    // The total will be 0 and will be determined after consultation

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: 0, // Will be determined after consultation
        shippingAddress: validatedData.shippingAddress,
        orderItems: {
          create: validatedData.items.map((item) => {
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: 0, // Will be determined after consultation
            };
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send order confirmation email
    const { sendEmail, emailTemplates } = await import("@/lib/email");
    await sendEmail({
      to: session.user.email!,
      subject: emailTemplates.orderConfirmation(order, session.user).subject,
      html: emailTemplates.orderConfirmation(order, session.user).html,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

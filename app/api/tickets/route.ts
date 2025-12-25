import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";

export const dynamic = "force-dynamic";

const ticketSchema = z.object({
  orderId: z.string().nullable().optional(),
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
});

// GET /api/tickets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where =
      session.user.role === "ADMIN" ? {} : { userId: session.user.id };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              status: true,
            },
          },
          updates: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST /api/tickets
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ticketSchema.parse(body);

    // Verify the order belongs to the user (only if orderId is provided)
    let order = null;
    if (validatedData.orderId) {
      order = await prisma.order.findFirst({
        where: {
          id: validatedData.orderId,
          userId: session.user.id,
        },
      });

      if (!order) {
        return NextResponse.json(
          {
            error: "Order not found",
            message: "سفارش یافت نشد یا متعلق به شما نیست.",
            details: "The order was not found or does not belong to you",
          },
          { status: 404 }
        );
      }
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        orderId: validatedData.orderId || null,
        userId: session.user.id,
        subject: validatedData.subject,
        description: validatedData.description,
        priority: validatedData.priority || "MEDIUM",
        status: validatedData.status || "OPEN",
      },
      include: {
        order: true,
        user: true,
      },
    });

    // Send email notification to admin and create notification for user
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    const { sendEmail } = await import("@/lib/email");
    const { createTicketNotification } = await import("@/lib/notifications");

    for (const admin of adminUsers) {
      await sendEmail({
        to: admin.email,
        subject: `New Support Ticket: ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Support Ticket</h2>
            <p>A new support ticket has been created.</p>
            
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Ticket Details</h3>
              <p><strong>Ticket ID:</strong> ${ticket.id}</p>
              <p><strong>Subject:</strong> ${ticket.subject}</p>
              <p><strong>Priority:</strong> ${ticket.priority}</p>
              <p><strong>Order ID:</strong> ${ticket.orderId || "None"}</p>
              <p><strong>Customer:</strong> ${ticket.user.name} (${
          ticket.user.email
        })</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>Description</h3>
              <p style="white-space: pre-wrap;">${ticket.description}</p>
            </div>
          </div>
        `,
      });
    }

    // Create notification for the user
    await createTicketNotification(ticket.id, ticket.userId, "created");

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

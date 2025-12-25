import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ticketMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long"),
  isInternal: z.boolean().optional().default(false),
});

// POST /api/tickets/[id]/messages - Add a new message to a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthoried" }, { status: 403 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = ticketMessageSchema.parse(body);

    // Check if ticket exists and user has access
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check permissions - users can only access their own tickets, admins can access all
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = ticket.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only add messages to your own tickets" },
        { status: 403 }
      );
    }

    // Create the ticket update/message
    const ticketUpdate = await prisma.ticketUpdate.create({
      data: {
        ticketId: params.id,
        userId: session.user.id,
        message: validatedData.message,
        isInternal: validatedData.isInternal,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    // Send notifications for non-internal messages
    if (!validatedData.isInternal) {
      try {
        // Import notification functions dynamically to avoid circular dependencies
        const { createTicketNotification } = await import(
          "@/lib/notifications"
        );
        const { sendEmail, emailTemplates } = await import("@/lib/email");

        // Determine who to notify
        const recipient = isAdmin ? ticket.user : null; // If admin posted, notify user

        if (recipient) {
          // Send email notification
          await sendEmail({
            to: recipient.email,
            subject: `New message on ticket: ${ticket.subject}`,
            html: emailTemplates.ticketUpdate(ticket, recipient, ticketUpdate)
              .html,
          });

          // Create in-app notification
          await createTicketNotification(
            ticket.id,
            recipient.id,
            "message_added"
          );
        }
      } catch (notificationError) {
        // Log notification errors but don't fail the request
        console.error("Failed to send notifications:", notificationError);
      }
    }

    // Update ticket's last activity timestamp
    await prisma.ticket.update({
      where: { id: params.id },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Message added successfully",
        data: ticketUpdate,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Error adding ticket message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/tickets/[id]/messages - Get all messages for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if ticket exists and user has access
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check permissions
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = ticket.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error: "Forbidden - You can only view messages from your own tickets",
        },
        { status: 403 }
      );
    }

    // Get URL search params for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // Max 50 per page
    const skip = (page - 1) * limit;

    // Build where clause - admins see all messages, users only see non-internal
    const whereClause = {
      ticketId: params.id,
      ...(isAdmin ? {} : { isInternal: false }),
    };

    // Get messages with pagination
    const [messages, totalCount] = await Promise.all([
      prisma.ticketUpdate.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.ticketUpdate.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: messages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

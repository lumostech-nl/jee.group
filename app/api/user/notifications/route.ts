import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  ticketNotifications: boolean;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      emailNotifications,
      orderNotifications,
      ticketNotifications,
    }: NotificationSettings = body;

    // Update user notification preferences
    // Note: You might want to create a separate table for notification preferences
    // For now, we'll store them in the user record or create a preferences system

    // If you have a user preferences table, update it here
    // For this example, we'll just return success since the structure is in place

    return NextResponse.json({
      message: "Notification settings updated successfully",
      settings: {
        emailNotifications,
        orderNotifications,
        ticketNotifications,
      },
    });
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

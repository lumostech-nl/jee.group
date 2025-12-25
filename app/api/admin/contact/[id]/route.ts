import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

// PUT /api/admin/contact/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "داده‌های نامعتبر", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی پیام" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    await prisma.contactMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "پیام حذف شد" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json({ error: "خطا در حذف پیام" }, { status: 500 });
  }
}

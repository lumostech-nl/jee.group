import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

// POST /api/contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Save the contact message
    const contactMessage = await prisma.contactMessage.create({
      data: validatedData,
    });

    // Send confirmation email to the user
    await sendEmail({
      to: validatedData.email,
      subject: emailTemplates.contactConfirmation(contactMessage).subject,
      html: emailTemplates.contactConfirmation(contactMessage).html,
    });

    // Send notification email to admin
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    for (const admin of adminUsers) {
      await sendEmail({
        to: admin.email,
        subject: `پیام جدید از فرم تماس: ${validatedData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
            <h2 style="color: #37322F;">پیام جدید از فرم تماس</h2>
            <p>یک پیام جدید از فرم تماس دریافت شده است.</p>
            
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>جزئیات تماس</h3>
              <p><strong>نام:</strong> ${validatedData.name}</p>
              <p><strong>ایمیل:</strong> ${validatedData.email}</p>
              ${
                validatedData.phone
                  ? `<p><strong>تلفن:</strong> ${validatedData.phone}</p>`
                  : ""
              }
              <p><strong>موضوع:</strong> ${validatedData.subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>پیام</h3>
              <p style="white-space: pre-wrap;">${validatedData.message}</p>
            </div>
            
            <p>لطفاً ظرف ۲۴ ساعت به این درخواست پاسخ دهید.</p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { message: "پیام با موفقیت ارسال شد" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "داده‌های نامعتبر", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error processing contact message:", error);
    return NextResponse.json(
      { error: "خطا در ارسال پیام تماس" },
      { status: 500 }
    );
  }
}

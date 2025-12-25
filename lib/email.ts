import nodemailer from "nodemailer";

// Create transporter for Titan email server
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "mail.titan.email",
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER || "web@jee.group",
    pass: process.env.EMAIL_SERVER_PASSWORD, // You'll add the password here
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"JEE Group" <web@jee.group>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (order: any, user: any) => ({
    subject: `Order Confirmation - Order #${order.id.slice(-8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${user.name || "Customer"},</p>
        <p>Thank you for your order! We have received your order and are processing it.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(
            order.createdAt
          ).toLocaleDateString()}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Order Items</h3>
          ${order.orderItems
            .map(
              (item: any) => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>${item.product.name}</strong> x ${item.quantity}</p>
              <p>Price: $${item.price.toFixed(2)}</p>
            </div>
          `
            )
            .join("")}
        </div>
        
        <p>You can track your order status in your dashboard.</p>
        <p>Thank you for choosing us!</p>
      </div>
    `,
  }),

  orderStatusUpdate: (order: any, user: any, newStatus: string) => ({
    subject: `Order Update - Order #${order.id.slice(-8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Dear ${user.name || "Customer"},</p>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>New Status:</strong> ${newStatus}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        
        <p>You can track your order status in your dashboard.</p>
        <p>Thank you for choosing us!</p>
      </div>
    `,
  }),

  contactConfirmation: (contact: any) => ({
    subject: `تأیید دریافت پیام - ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
        <h2 style="color: #37322F;">تأیید دریافت پیام</h2>
        <p>سلام ${contact.name}،</p>
        <p>از تماس شما متشکریم! پیام شما دریافت شد و به زودی پاسخ خواهیم داد.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>پیام شما</h3>
          <p><strong>موضوع:</strong> ${contact.subject}</p>
          <p><strong>پیام:</strong></p>
          <p style="white-space: pre-wrap;">${contact.message}</p>
        </div>
        
        <p>ظرف ۲۴ ساعت به درخواست شما پاسخ خواهیم داد.</p>
        <p>از تماس شما متشکریم!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          آتی ارتباطات ژی - متخصص در راهکارهای تحول دیجیتال
        </p>
      </div>
    `,
  }),

  ticketUpdate: (ticket: any, user: any, update: any) => ({
    subject: `Ticket Update - ${ticket.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Ticket Update</h2>
        <p>Dear ${user.name || "Customer"},</p>
        <p>There has been an update to your support ticket.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Ticket Details</h3>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Latest Update</h3>
          <p style="white-space: pre-wrap;">${update.message}</p>
          <p><em>Posted on: ${new Date(
            update.createdAt
          ).toLocaleString()}</em></p>
        </div>
        
        <p>You can view and respond to this ticket in your dashboard.</p>
        <p>Thank you for your patience!</p>
      </div>
    `,
  }),
};

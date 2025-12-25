import { prisma } from './db'

export interface CreateNotificationData {
  userId: string
  title: string
  message: string
  type: 'ORDER_UPDATE' | 'TICKET_UPDATE' | 'SYSTEM' | 'PROMOTION'
  data?: any
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        data: data.data || null,
      },
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export async function createOrderNotification(orderId: string, userId: string, status: string) {
  const titles = {
    PENDING: 'سفارش دریافت شد',
    CONFIRMED: 'سفارش تایید شد',
    SHIPPED: 'سفارش ارسال شد',
    DELIVERED: 'سفارش تحویل داده شد',
    CANCELLED: 'سفارش لغو شد',
  }

  const messages = {
    PENDING: 'سفارش شما دریافت شد و در حال پردازش است.',
    CONFIRMED: 'سفارش شما تایید شد و در حال آماده‌سازی است.',
    SHIPPED: 'سفارش شما ارسال شد و در راه است.',
    DELIVERED: 'سفارش شما با موفقیت تحویل داده شد.',
    CANCELLED: 'سفارش شما لغو شد.',
  }

  return createNotification({
    userId,
    title: titles[status as keyof typeof titles] || 'به‌روزرسانی سفارش',
    message: messages[status as keyof typeof messages] || 'وضعیت سفارش شما به‌روزرسانی شد.',
    type: 'ORDER_UPDATE',
    data: { orderId, status },
  })
}

export async function createTicketNotification(ticketId: string, userId: string, action: string) {
  const titles = {
    created: 'تیکت پشتیبانی جدید',
    updated: 'به‌روزرسانی تیکت',
    resolved: 'تیکت حل شد',
  }

  const messages = {
    created: 'تیکت پشتیبانی جدیدی برای سفارش شما ایجاد شد.',
    updated: 'به‌روزرسانی در تیکت پشتیبانی شما انجام شد.',
    resolved: 'تیکت پشتیبانی شما حل شد.',
  }

  return createNotification({
    userId,
    title: titles[action as keyof typeof titles] || 'به‌روزرسانی تیکت',
    message: messages[action as keyof typeof messages] || 'تیکت پشتیبانی شما به‌روزرسانی شد.',
    type: 'TICKET_UPDATE',
    data: { ticketId, action },
  })
}

export async function createSystemNotification(userId: string, title: string, message: string, data?: any) {
  return createNotification({
    userId,
    title,
    message,
    type: 'SYSTEM',
    data,
  })
}

export async function createPromotionNotification(userId: string, title: string, message: string, data?: any) {
  return createNotification({
    userId,
    title,
    message,
    type: 'PROMOTION',
    data,
  })
}

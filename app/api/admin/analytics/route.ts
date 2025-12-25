import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel
    const [users, orders, tickets, products, orderItems] = await Promise.all([
      // Users data
      prisma.user.findMany({
        include: {
          _count: {
            select: {
              orders: true,
              tickets: true,
            },
          },
        },
      }),

      // Orders data
      prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Tickets data
      prisma.ticket.findMany(),

      // Products data
      prisma.product.findMany(),

      // Order items for product analytics
      prisma.orderItem.findMany({
        include: {
          product: true,
        },
      }),
    ]);

    // Calculate user analytics
    const userAnalytics = {
      total: users.length,
      newThisMonth: users.filter((user) => user.createdAt >= startOfMonth)
        .length,
      verified: users.filter((user) => user.emailVerified).length,
      unverified: users.filter((user) => !user.emailVerified).length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
    };

    // Calculate order analytics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const averageOrderValue =
      orders.length > 0 ? totalRevenue / orders.length : 0;

    const orderAnalytics = {
      total: orders.length,
      totalRevenue,
      averageOrderValue,
      byStatus: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      recentOrders: orders.slice(0, 10).map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        user: {
          name: order.user.name || "Unknown",
        },
      })),
    };

    // Calculate ticket analytics
    const ticketAnalytics = {
      total: tickets.length,
      open: tickets.filter(
        (ticket) => ticket.status === "OPEN" || ticket.status === "IN_PROGRESS"
      ).length,
      resolved: tickets.filter(
        (ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED"
      ).length,
      byStatus: tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      byPriority: tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
    };

    // Calculate product analytics
    const productAnalytics = {
      total: products.length,
      topSelling: Object.entries(
        orderItems.reduce((acc, item) => {
          const productId = item.product.id;
          if (!acc[productId]) {
            acc[productId] = {
              id: productId,
              name: item.product.name,
              totalSold: 0,
              revenue: 0,
            };
          }
          acc[productId].totalSold += item.quantity;
          acc[productId].revenue += Number(item.price) * item.quantity;
          return acc;
        }, {} as { [key: string]: { id: string; name: string; totalSold: number; revenue: number } })
      )
        .map(([_, data]) => data)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10),
    };

    return NextResponse.json({
      users: userAnalytics,
      orders: orderAnalytics,
      tickets: ticketAnalytics,
      products: productAnalytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewTicketDialog from "@/components/admin/ViewTicketDialog";
import ViewOrderDialog from "@/components/admin/ViewOrderDialog";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  Plus,
  Eye,
  Bell,
  Inbox,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import { formatPrice } from "@/lib/utils";
import { emitAppEvent, AppEvents } from "@/lib/app-events";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    price: number;
    product: {
      name: string;
      image?: string;
    };
  }>;
}

interface Ticket {
  id: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  order: {
    id: string;
    status: string;
  };
  updates: Array<{
    id: string;
    message: string;
    createdAt: string;
    user: {
      name: string;
      role?: string;
    };
  }>;
}

interface TicketMessage {
  id: string;
  message: string;
  createdAt: string;
  isInternal: boolean;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ORDER_UPDATE" | "TICKET_UPDATE" | "SYSTEM" | "PROMOTION";
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/auth/signin");
    }

    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, ticketsRes, notificationsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/tickets"),
        fetch("/api/notifications"),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData.tickets || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
        setUnreadCount(notificationsData.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "URGENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        const newUnreadCount = Math.max(0, unreadCount - 1);

        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(newUnreadCount);

        // Emit event to update other components (like header)
        emitAppEvent(AppEvents.NOTIFICATION_READ, {
          notificationId,
          newUnreadCount,
        });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_UPDATE":
        return <Package className="h-4 w-4" />;
      case "TICKET_UPDATE":
        return <MessageSquare className="h-4 w-4" />;
      case "SYSTEM":
        return <Bell className="h-4 w-4" />;
      case "PROMOTION":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ORDER_UPDATE":
        return "text-blue-600";
      case "TICKET_UPDATE":
        return "text-purple-600";
      case "SYSTEM":
        return "text-gray-600";
      case "PROMOTION":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getRelatedTabForNotification = (type: string) => {
    switch (type) {
      case "ORDER_UPDATE":
        return "orders";
      case "TICKET_UPDATE":
        return "tickets";
      default:
        return "notifications";
    }
  };

  const viewNotification = (notification: Notification) => {
    const targetTab = getRelatedTabForNotification(notification.type);
    setActiveTab(targetTab);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F3]">
        <div className="max-w-[1060px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[rgba(55,50,47,0.1)] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-[rgba(55,50,47,0.05)] rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center"
      dir="rtl"
    >
      <PersianHeader />

      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Profile Header Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[80px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[22px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    داشبورد کاربری
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    {session?.user ? (
                      <>
                        خوش آمدید، {session.user.name}! اینجا می‌توانید
                        سفارش‌های خود را مدیریت کنید
                      </>
                    ) : (
                      <>
                        لطفاً برای دسترسی به داشبورد وارد حساب کاربری خود شوید
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Dashboard Welcome Message */}
              <div className="backdrop-blur-[8.25px] flex justify-center items-center">
                <div className="text-center">
                  <p className="text-[#828387] text-sm">
                    {session?.user ? (
                      <>
                        خوش آمدید! از داشبورد خود برای مدیریت سفارش‌ها و تنظیمات
                        استفاده کنید
                      </>
                    ) : (
                      <>لطفاً از طریق منوی بالا وارد حساب کاربری خود شوید</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="w-full py-8 sm:py-12 md:py-16">
            {session?.user ? (
              <div className="max-w-[1060px] mx-auto px-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-[#37322F]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#37322F] mb-1 text-right">
                      {orders.length}
                    </div>
                    <div className="text-sm text-[#828387] text-right">
                      سفارش‌های کل
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                        <MessageSquare className="h-5 w-5 text-[#37322F]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#37322F] mb-1 text-right">
                      {
                        tickets.filter(
                          (t) =>
                            t.status === "OPEN" || t.status === "IN_PROGRESS"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-[#828387] text-right">
                      تیکت‌های باز
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                        <Package className="h-5 w-5 text-[#37322F]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#37322F] mb-1 text-right">
                      {formatPrice(
                        orders.reduce(
                          (sum, order) => sum + Number(order.total),
                          0
                        )
                      )}
                    </div>
                    <div className="text-sm text-[#828387] text-right">
                      مجموع پرداختی
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                        <Bell className="h-5 w-5 text-[#37322F]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#37322F] mb-1 text-right">
                      {unreadCount}
                    </div>
                    <div className="text-sm text-[#828387] text-right">
                      اعلان‌های خوانده نشده
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-white border border-[rgba(55,50,47,0.08)] p-1 h-auto">
                    <TabsTrigger
                      value="overview"
                      className="cursor-pointer data-[state=active]:bg-[rgba(55,50,47,0.05)] data-[state=active]:shadow-sm text-right rounded-md transition-all py-2 h-auto"
                    >
                      نمای کلی
                    </TabsTrigger>
                    <TabsTrigger
                      value="orders"
                      className="cursor-pointer data-[state=active]:bg-[rgba(55,50,47,0.05)] data-[state=active]:shadow-sm text-right rounded-md transition-all py-2 h-auto"
                    >
                      سفارش‌ها
                    </TabsTrigger>
                    <TabsTrigger
                      value="tickets"
                      className="cursor-pointer data-[state=active]:bg-[rgba(55,50,47,0.05)] data-[state=active]:shadow-sm text-right rounded-md transition-all py-2 h-auto"
                    >
                      پشتیبانی
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="cursor-pointer data-[state=active]:bg-[rgba(55,50,47,0.05)] data-[state=active]:shadow-sm text-right rounded-md transition-all py-2 h-auto"
                    >
                      اعلان‌ها
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Recent Orders */}
                      <div
                        dir="rtl"
                        className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab("orders")}
                            className="text-[#828387] hover:text-[#37322F] text-right"
                          >
                            مشاهده همه
                          </Button>
                          <h3 className="text-lg font-semibold text-[#37322F] text-right">
                            سفارش‌های اخیر
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {orders.slice(0, 3).map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-3 bg-[rgba(55,50,47,0.02)] rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm text-[#37322F] text-right">
                                  سفارش <span>{order.id.slice(-8)}#</span>
                                </p>
                                <p className="text-xs text-[#828387] text-right">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "fa-IR"
                                  )}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-[#37322F]">
                                  {formatPrice(order.total)}
                                </p>
                                <Badge
                                  className={`text-xs ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status === "PENDING"
                                    ? "در انتظار"
                                    : order.status === "CONFIRMED"
                                    ? "تایید شده"
                                    : order.status === "SHIPPED"
                                    ? "ارسال شده"
                                    : order.status === "DELIVERED"
                                    ? "تحویل داده شده"
                                    : order.status === "CANCELLED"
                                    ? "لغو شده"
                                    : order.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {orders.length === 0 && (
                            <p className="text-center text-[#828387] py-4">
                              سفارشی وجود ندارد
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Recent Notifications */}
                      <div
                        dir="rtl"
                        className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab("notifications")}
                            className="text-[#828387] hover:text-[#37322F] text-right"
                          >
                            مشاهده همه
                          </Button>
                          <h3 className="text-lg font-semibold text-[#37322F] text-right">
                            اعلان‌های اخیر
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {notifications.slice(0, 3).map((notification) => (
                            <div
                              key={notification.id}
                              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                notification.isRead
                                  ? "bg-[rgba(55,50,47,0.02)]"
                                  : "bg-[rgba(55,50,47,0.05)]"
                              }`}
                            >
                              <div
                                className={`p-1 rounded ${getNotificationColor(
                                  notification.type
                                )}`}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-[#37322F] text-right">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-[#828387] line-clamp-2 text-right">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-[#828387] mt-1 text-right">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleDateString("fa-IR")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[rgba(55,50,47,0.12)] whitespace-nowrap"
                                  onClick={() => viewNotification(notification)}
                                >
                                  مشاهده پیام
                                </Button>
                              </div>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <p className="text-center text-[#828387] py-4">
                              اعلانی وجود ندارد
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#37322F] text-right">
                        سفارش‌های شما
                      </h2>
                      <div className="flex-1"></div>
                    </div>

                    {orders.length === 0 ? (
                      <div className="bg-white rounded-lg p-12 text-center border border-[rgba(55,50,47,0.08)]">
                        <Package className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#37322F] mb-2">
                          سفارشی وجود ندارد
                        </h3>
                        <p className="text-[#828387] mb-4">
                          برای دیدن سفارش‌های خود شروع به خرید کنید.
                        </p>
                        <Button
                          onClick={() => (window.location.href = "/products")}
                          className="bg-[#37322F] hover:bg-[#37322F]/90 text-white"
                        >
                          مشاهده محصولات
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-[#37322F] text-right">
                                  سفارش #{order.id.slice(-8)}
                                </h3>
                                <p className="text-sm text-[#828387] text-right">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "fa-IR"
                                  )}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status === "PENDING"
                                  ? "در انتظار"
                                  : order.status === "CONFIRMED"
                                  ? "تایید شده"
                                  : order.status === "SHIPPED"
                                  ? "ارسال شده"
                                  : order.status === "DELIVERED"
                                  ? "تحویل داده شده"
                                  : order.status === "CANCELLED"
                                  ? "لغو شده"
                                  : order.status}
                              </Badge>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[rgba(55,50,47,0.12)] text-right"
                                  onClick={() => handleViewOrderDetails(order)}
                                >
                                  <Eye className="h-4 w-4 ml-2" />
                                  مشاهده جزئیات
                                </Button>
                                <span className="text-lg font-bold text-[#37322F]">
                                  مجموع: {formatPrice(order.total)}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium text-[#37322F] text-right">
                                  اقلام:
                                </h4>
                                {order.orderItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-[#37322F] text-right">
                                      {item.product.name}
                                    </span>
                                    <span className="text-[#828387]">
                                      {formatPrice(item.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {order.status === "CONFIRMED" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[rgba(55,50,47,0.12)]"
                                  onClick={() => {
                                    window.location.href = `/tickets/new?orderId=${order.id}`;
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  ایجاد تیکت پشتیبانی
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="tickets" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#37322F] text-right">
                        تیکت‌های پشتیبانی
                      </h2>
                      <Button
                        onClick={() => (window.location.href = "/tickets/new")}
                        className="bg-[#37322F] hover:bg-[#37322F]/90 text-white text-right"
                      >
                        <Plus className="h-4 w-4 ml-2" />
                        تیکت جدید
                      </Button>
                    </div>

                    {tickets.length === 0 ? (
                      <div className="bg-white rounded-lg p-12 text-center border border-[rgba(55,50,47,0.08)]">
                        <MessageSquare className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#37322F] mb-2">
                          تیکتی وجود ندارد
                        </h3>
                        <p className="text-[#828387] mb-4">
                          در صورت نیاز به کمک با سفارش‌های خود، تیکت ایجاد کنید.
                        </p>
                        <Button
                          onClick={() =>
                            (window.location.href = "/tickets/new")
                          }
                          className="bg-[#37322F] hover:bg-[#37322F]/90 text-white"
                        >
                          ایجاد تیکت
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-[#37322F] text-right">
                                  {ticket.subject}
                                </h3>
                                <p className="text-sm text-[#828387] text-right">
                                  {ticket.order
                                    ? `سفارش #${ticket.order.id.slice(-8)} • `
                                    : ""}
                                  {new Date(
                                    ticket.createdAt
                                  ).toLocaleDateString("fa-IR")}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={getTicketStatusColor(
                                    ticket.status
                                  )}
                                >
                                  {ticket.status === "OPEN"
                                    ? "باز"
                                    : ticket.status === "IN_PROGRESS"
                                    ? "در حال بررسی"
                                    : ticket.status === "RESOLVED"
                                    ? "حل شده"
                                    : ticket.status === "CLOSED"
                                    ? "بسته شده"
                                    : ticket.status}
                                </Badge>
                                <Badge
                                  className={getPriorityColor(ticket.priority)}
                                >
                                  {ticket.priority === "LOW"
                                    ? "کم"
                                    : ticket.priority === "MEDIUM"
                                    ? "متوسط"
                                    : ticket.priority === "HIGH"
                                    ? "زیاد"
                                    : ticket.priority === "URGENT"
                                    ? "فوری"
                                    : ticket.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[rgba(55,50,47,0.12)] text-right"
                                  onClick={() =>
                                    handleViewTicketDetails(ticket)
                                  }
                                >
                                  <Eye className="h-4 w-4 ml-2" />
                                  مشاهده جزئیات
                                </Button>
                                <span className="text-sm text-[#828387]">
                                  {ticket.updates.length} به‌روزرسانی
                                </span>
                              </div>

                              {ticket.updates.length > 0 && (
                                <div className="bg-[rgba(55,50,47,0.02)] p-3 rounded-lg">
                                  <p className="text-sm text-[#37322F] text-right">
                                    {
                                      ticket.updates[ticket.updates.length - 1]
                                        .message
                                    }
                                  </p>
                                  <p className="text-xs text-[#828387] mt-2 text-right">
                                    توسط{" "}
                                    {
                                      ticket.updates[ticket.updates.length - 1]
                                        .user.name
                                    }{" "}
                                    •{" "}
                                    {new Date(
                                      ticket.updates[
                                        ticket.updates.length - 1
                                      ].createdAt
                                    ).toLocaleString("fa-IR")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#37322F] text-right">
                        اعلان‌ها
                      </h2>
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          className="border-[rgba(55,50,47,0.12)] text-right"
                          onClick={async () => {
                            // Mark all as read
                            const unreadNotifications = notifications.filter(
                              (n) => !n.isRead
                            );
                            for (const notification of unreadNotifications) {
                              await markNotificationAsRead(notification.id);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 ml-2" />
                          علامت‌گذاری همه به عنوان خوانده شده
                        </Button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="bg-white rounded-lg p-12 text-center border border-[rgba(55,50,47,0.08)]">
                        <Bell className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#37322F] mb-2">
                          اعلانی وجود ندارد
                        </h3>
                        <p className="text-[#828387]">
                          به‌روزرسانی‌های مهم خود را اینجا مشاهده خواهید کرد.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] transition-all hover:shadow-sm ${
                              !notification.isRead ? "ring-2 ring-blue-100" : ""
                            }`}
                          >
                            <div className="flex items-start gap-4" dir="rtl">
                              <div
                                className={`p-2 rounded-lg ${getNotificationColor(
                                  notification.type
                                )} bg-opacity-10`}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h3 className="font-semibold text-[#37322F] mb-1 text-right">
                                      {notification.title}
                                    </h3>
                                    <p className="text-[#828387] text-sm mb-2 text-right">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-[#828387] text-right">
                                      {new Date(
                                        notification.createdAt
                                      ).toLocaleString("fa-IR")}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!notification.isRead && (
                                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[rgba(55,50,47,0.12)] whitespace-nowrap"
                                      onClick={() =>
                                        viewNotification(notification)
                                      }
                                    >
                                      مشاهده پیام
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="max-w-[1060px] mx-auto px-4">
                <div className="bg-white rounded-lg p-12 text-center border border-[rgba(55,50,47,0.08)]">
                  <Bell className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#37322F] mb-2">
                    دسترسی محدود
                  </h3>
                  <p className="text-[#828387] mb-4">
                    لطفاً برای دسترسی به داشبورد وارد حساب کاربری خود شوید.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/auth/signin")}
                    className="bg-[#37322F] hover:bg-[#37322F]/90 text-white"
                  >
                    ورود به حساب
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PersianFooter />

      {/* Dialog Components */}
      <ViewTicketDialog
        ticket={selectedTicket}
        isOpen={isTicketDialogOpen}
        onClose={() => setIsTicketDialogOpen(false)}
      />

      <ViewOrderDialog
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
      />
    </div>
  );
}

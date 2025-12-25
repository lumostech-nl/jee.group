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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/AdminLayout";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface AnalyticsData {
  users: {
    total: number;
    newThisMonth: number;
    verified: number;
    unverified: number;
    byRole: { [key: string]: number };
  };
  orders: {
    total: number;
    totalRevenue: number;
    averageOrderValue: number;
    byStatus: { [key: string]: number };
    recentOrders: Array<{
      id: string;
      total: number;
      status: string;
      createdAt: string;
      user: { name: string };
    }>;
  };
  tickets: {
    total: number;
    open: number;
    resolved: number;
    byStatus: { [key: string]: number };
    byPriority: { [key: string]: number };
  };
  products: {
    total: number;
    topSelling: Array<{
      id: string;
      name: string;
      totalSold: number;
      revenue: number;
    }>;
  };
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchAnalytics();
  }, [session, status]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "CONFIRMED":
        return "text-blue-600";
      case "SHIPPED":
        return "text-purple-600";
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "text-green-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-orange-600";
      case "URGENT":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div dir="rtl" className="space-y-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#37322F]">
            داشبورد تحلیل‌ها
          </h1>
          <p className="text-[#828387]">بینش‌های کسب‌وکار و معیارهای عملکرد</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <DollarSign className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {formatPrice(analytics.orders.totalRevenue)}
            </div>
            <div className="text-sm text-[#828387]">مجموع درآمد</div>
            <div className="text-xs text-[#828387] mt-1">
              {analytics.orders.total} سفارش کل
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <Users className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {analytics.users.total}
            </div>
            <div className="text-sm text-[#828387]">کل کاربران</div>
            <div className="text-xs text-[#828387] mt-1">
              {analytics.users.newThisMonth} جدید این ماه
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <MessageSquare className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {analytics.tickets.open}
            </div>
            <div className="text-sm text-[#828387]">تیکت‌های باز</div>
            <div className="text-xs text-[#828387] mt-1">
              {analytics.tickets.resolved} حل شده
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <Package className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {analytics.products.total}
            </div>
            <div className="text-sm text-[#828387]">محصولات</div>
            <div className="text-xs text-[#828387] mt-1">
              {analytics.products.topSelling.length} پرفروش
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="orders">سفارشات</TabsTrigger>
            <TabsTrigger value="users">کاربران</TabsTrigger>
            <TabsTrigger value="support">پشتیبانی</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Status Distribution */}
              <div
                dir="rtl"
                className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-[#37322F]">
                    توزیع وضعیت سفارشات
                  </h3>
                  <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                    <BarChart3 className="h-5 w-5 text-[#37322F]" />
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(analytics.orders.byStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              status === "PENDING"
                                ? "bg-yellow-500"
                                : status === "CONFIRMED"
                                ? "bg-blue-500"
                                : status === "SHIPPED"
                                ? "bg-purple-500"
                                : status === "DELIVERED"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-[#37322F]">
                            {status === "PENDING"
                              ? "در انتظار"
                              : status === "CONFIRMED"
                              ? "تایید شده"
                              : status === "SHIPPED"
                              ? "ارسال شده"
                              : status === "DELIVERED"
                              ? "تحویل شده"
                              : status === "CANCELLED"
                              ? "لغو شده"
                              : status}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#37322F]">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* User Role Distribution */}
              <div
                dir="rtl"
                className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                    <Users className="h-5 w-5 text-[#37322F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#37322F]">
                    توزیع نقش کاربران
                  </h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(analytics.users.byRole).map(
                    ([role, count]) => (
                      <div
                        key={role}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              role === "ADMIN" ? "bg-purple-500" : "bg-blue-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-[#37322F]">
                            {role === "ADMIN" ? "مدیر" : "مشتری"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#37322F]">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div
                dir="rtl"
                className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-[#37322F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#37322F]">
                    سفارشات اخیر
                  </h3>
                </div>
                <div className="space-y-3">
                  {analytics.orders.recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-[rgba(55,50,47,0.02)] rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm text-[#37322F]">
                          سفارش <span>{order.id.slice(-8)}#</span>
                        </p>
                        <p className="text-xs text-[#828387]">
                          {order.user.name}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-[#37322F]">
                          {formatPrice(order.total)}
                        </p>
                        <p
                          className={`text-xs ${
                            order.status === "PENDING"
                              ? "text-yellow-600"
                              : order.status === "CONFIRMED"
                              ? "text-blue-600"
                              : order.status === "SHIPPED"
                              ? "text-purple-600"
                              : order.status === "DELIVERED"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {order.status === "PENDING"
                            ? "در انتظار"
                            : order.status === "CONFIRMED"
                            ? "تایید شده"
                            : order.status === "SHIPPED"
                            ? "ارسال شده"
                            : order.status === "DELIVERED"
                            ? "تحویل شده"
                            : order.status === "CANCELLED"
                            ? "لغو شده"
                            : order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[#37322F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#37322F]">
                    پرفروش‌ترین محصولات
                  </h3>
                </div>
                <div className="space-y-3">
                  {analytics.products.topSelling.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-[rgba(55,50,47,0.02)] rounded-lg"
                    >
                      <div className="">
                        <p className="font-medium text-sm text-[#37322F]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#828387]">
                          {product.totalSold} فروخته شده
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm text-[#37322F]">
                          {formatPrice(product.revenue)}
                        </p>
                        <p className="text-xs text-[#828387]">درآمد</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  آمار سفارشات
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">کل سفارشات:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.orders.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">مجموع درآمد:</span>
                    <span className="font-bold text-[#37322F]">
                      {formatPrice(analytics.orders.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">میانگین ارزش سفارش:</span>
                    <span className="font-bold text-[#37322F]">
                      {Number(analytics.orders.averageOrderValue).toFixed(2)}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              <div
                dir="rtl"
                className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  تجزیه وضعیت سفارشات
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.orders.byStatus).map(
                    ([status, count]) => {
                      const percentage = (count / analytics.orders.total) * 100;
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#37322F]">
                              {status === "PENDING"
                                ? "در انتظار"
                                : status === "CONFIRMED"
                                ? "تایید شده"
                                : status === "SHIPPED"
                                ? "ارسال شده"
                                : status === "DELIVERED"
                                ? "تحویل شده"
                                : status === "CANCELLED"
                                ? "لغو شده"
                                : status}
                            </span>
                            <span className="text-[#37322F]">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-[rgba(55,50,47,0.1)] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                status === "PENDING"
                                  ? "bg-yellow-500"
                                  : status === "CONFIRMED"
                                  ? "bg-blue-500"
                                  : status === "SHIPPED"
                                  ? "bg-purple-500"
                                  : status === "DELIVERED"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  آمار کاربران
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">کل کاربران:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.users.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">جدید این ماه:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.users.newThisMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">تایید شده:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.users.verified}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">تایید نشده:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.users.unverified}
                    </span>
                  </div>
                </div>
              </div>

              <div
                dir="rtl"
                className="text-right bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  توزیع نقش کاربران
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.users.byRole).map(
                    ([role, count]) => {
                      const percentage = (count / analytics.users.total) * 100;
                      return (
                        <div key={role} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#37322F]">
                              {role === "ADMIN" ? "مدیر" : "مشتری"}
                            </span>
                            <span className="text-[#37322F]">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-[rgba(55,50,47,0.1)] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                role === "ADMIN"
                                  ? "bg-purple-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  آمار پشتیبانی
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">کل تیکت‌ها:</span>
                    <span className="font-bold text-[#37322F]">
                      {analytics.tickets.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">تیکت‌های باز:</span>
                    <span className="font-bold text-yellow-600">
                      {analytics.tickets.open}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#828387]">تیکت‌های حل شده:</span>
                    <span className="font-bold text-green-600">
                      {analytics.tickets.resolved}
                    </span>
                  </div>
                </div>
              </div>

              <div
                dir="rtl"
                className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]"
              >
                <h3 className="text-lg font-semibold text-[#37322F] mb-4">
                  توزیع اولویت تیکت‌ها
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.tickets.byPriority).map(
                    ([priority, count]) => {
                      const percentage =
                        (count / analytics.tickets.total) * 100;
                      return (
                        <div key={priority} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span
                              className={`text-[#37322F] ${
                                priority === "LOW"
                                  ? "text-green-600"
                                  : priority === "MEDIUM"
                                  ? "text-yellow-600"
                                  : priority === "HIGH"
                                  ? "text-orange-600"
                                  : "text-red-600"
                              }`}
                            >
                              {priority === "LOW"
                                ? "کم"
                                : priority === "MEDIUM"
                                ? "متوسط"
                                : priority === "HIGH"
                                ? "بالا"
                                : priority === "URGENT"
                                ? "فوری"
                                : priority}
                            </span>
                            <span className="text-[#37322F]">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-[rgba(55,50,47,0.1)] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                priority === "LOW"
                                  ? "bg-green-500"
                                  : priority === "MEDIUM"
                                  ? "bg-yellow-500"
                                  : priority === "HIGH"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

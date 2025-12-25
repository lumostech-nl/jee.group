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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  Home,
  ChevronLeft,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    price: number;
    product: Product;
  }>;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
  openTickets: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, ticketsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/tickets"),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData.tickets || []);
      }

      // Calculate stats
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const ticketsData = await ticketsRes.json();

      const totalProducts = productsData.products?.length || 0;
      const totalOrders = ordersData.orders?.length || 0;
      const totalRevenue =
        ordersData.orders?.reduce(
          (sum: number, order: Order) => sum + Number(order.total),
          0
        ) || 0;
      const activeProducts =
        productsData.products?.filter((p: Product) => p.isActive).length || 0;
      const openTickets =
        ticketsData.tickets?.filter(
          (t: Ticket) => t.status === "OPEN" || t.status === "IN_PROGRESS"
        ).length || 0;

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        activeProducts,
        openTickets,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTickets(
          tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
          )
        );
      } else {
        alert("Failed to update ticket status");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket status");
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
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/analytics" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    تحلیل‌ها
                  </h3>
                  <p className="text-sm text-gray-600">آمار و گزارشات</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                    سفارشات
                  </h3>
                  <p className="text-sm text-gray-600">مدیریت سفارشات</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/tickets" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                    تیکت‌ها
                  </h3>
                  <p className="text-sm text-gray-600">پشتیبانی مشتریان</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                    کاربران
                  </h3>
                  <p className="text-sm text-gray-600">مدیریت کاربران</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                  <Package className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                    محصولات
                  </h3>
                  <p className="text-sm text-gray-600">
                    مدیریت محصولات و سرویس‌ها
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/contact" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition-colors">
                  <MessageSquare className="h-8 w-8 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors mb-2">
                    پیام‌های تماس
                  </h3>
                  <p className="text-sm text-gray-600">
                    مدیریت پیام‌های دریافتی
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {stats?.totalProducts || 0}
            </div>
            <div className="text-sm text-blue-600 font-medium">کل محصولات</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-sm text-green-600 font-medium">کل سفارشات</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-700 mb-1">
              {stats?.totalRevenue
                ? Number(stats.totalRevenue).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              کل درآمد (تومان)
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">
              {stats?.openTickets || 0}
            </div>
            <div className="text-sm text-orange-600 font-medium">
              تیکت‌های باز
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">محصولات اخیر</h3>
              <Link
                href="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-right flex-1">
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-left">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className="text-xs mb-1"
                    >
                      {product.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  محصولی یافت نشد
                </p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">سفارشات اخیر</h3>
              <Link
                href="/admin/orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      سفارش #{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">
                      {Number(order.total) > 0
                        ? formatPrice(order.total)
                        : "قیمت در انتظار تعیین"}
                    </p>
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "default"
                          : order.status === "PENDING"
                          ? "secondary"
                          : order.status === "CANCELLED"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {order.status === "DELIVERED"
                        ? "تحویل شده"
                        : order.status === "PENDING"
                        ? "در انتظار"
                        : order.status === "CANCELLED"
                        ? "لغو شده"
                        : "نامشخص"}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  سفارشی یافت نشد
                </p>
              )}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">تیکت‌های اخیر</h3>
              <Link
                href="/admin/tickets"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-4">
              {tickets.slice(0, 4).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-right flex-1">
                    <p className="font-semibold text-gray-900">
                      {ticket.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="text-left">
                    <Badge
                      variant={
                        ticket.status === "RESOLVED"
                          ? "default"
                          : ticket.status === "OPEN"
                          ? "destructive"
                          : ticket.status === "IN_PROGRESS"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs mb-1"
                    >
                      {ticket.status === "RESOLVED"
                        ? "حل شده"
                        : ticket.status === "OPEN"
                        ? "باز"
                        : ticket.status === "IN_PROGRESS"
                        ? "در حال بررسی"
                        : "نامشخص"}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {ticket.priority === "HIGH"
                        ? "بالا"
                        : ticket.priority === "MEDIUM"
                        ? "متوسط"
                        : ticket.priority === "LOW"
                        ? "پایین"
                        : "نامشخص"}
                    </p>
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-center text-gray-500 py-8">تیکتی یافت نشد</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

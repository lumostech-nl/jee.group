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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/AdminLayout";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  status: string;
  total: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: selectedOrder.total,
          description: selectedOrder.description,
        }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id ? selectedOrder : order
          )
        );
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <Package className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      (dateFilter === "today" &&
        new Date(order.createdAt).toDateString() ===
          new Date().toDateString()) ||
      (dateFilter === "week" &&
        new Date(order.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" &&
        new Date(order.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTabOrders = (tab: string) => {
    switch (tab) {
      case "pending":
        return filteredOrders.filter((o) => o.status === "PENDING");
      case "confirmed":
        return filteredOrders.filter((o) => o.status === "CONFIRMED");
      case "shipped":
        return filteredOrders.filter((o) => o.status === "SHIPPED");
      case "delivered":
        return filteredOrders.filter((o) => o.status === "DELIVERED");
      case "cancelled":
        return filteredOrders.filter((o) => o.status === "CANCELLED");
      default:
        return filteredOrders;
    }
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + Number(order.total), 0);
  };

  const getAverageOrderValue = () => {
    return orders.length > 0 ? getTotalRevenue() / orders.length : 0;
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#37322F]">
            مدیریت سفارشات
          </h1>
          <p className="text-[#828387]">
            مدیریت سفارشات، پیگیری ارسال‌ها و تحلیل فروش
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <ShoppingCart className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {orders.length}
            </div>
            <div className="text-sm text-[#828387]">کل سفارشات</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <DollarSign className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {formatPrice(getTotalRevenue())}
            </div>
            <div className="text-sm text-[#828387]">مجموع درآمد</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {formatPrice(getAverageOrderValue())}
            </div>
            <div className="text-sm text-[#828387]">میانگین سفارش</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <Clock className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {getOrdersByStatus("PENDING")}
            </div>
            <div className="text-sm text-[#828387]">سفارشات در انتظار</div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
              <BarChart3 className="h-5 w-5 text-[#37322F]" />
            </div>
            <h3 className="text-lg font-semibold text-[#37322F]">
              نمای کلی وضعیت سفارشات
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {getOrdersByStatus("PENDING")}
              </div>
              <div className="text-sm text-[#828387]">در انتظار</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getOrdersByStatus("CONFIRMED")}
              </div>
              <div className="text-sm text-[#828387]">تایید شده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getOrdersByStatus("SHIPPED")}
              </div>
              <div className="text-sm text-[#828387]">ارسال شده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getOrdersByStatus("DELIVERED")}
              </div>
              <div className="text-sm text-[#828387]">تحویل شده</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {getOrdersByStatus("CANCELLED")}
              </div>
              <div className="text-sm text-[#828387]">لغو شده</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                  <Search className="h-5 w-5 text-[#37322F]" />
                </div>
                <h3 className="text-lg font-semibold text-[#37322F]">
                  فیلترها
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="جستجوی سفارشات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[rgba(55,50,47,0.08)]"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-[rgba(55,50,47,0.08)] rounded-md bg-white"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="PENDING">در انتظار</option>
                  <option value="CONFIRMED">تایید شده</option>
                  <option value="SHIPPED">ارسال شده</option>
                  <option value="DELIVERED">تحویل شده</option>
                  <option value="CANCELLED">لغو شده</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-[rgba(55,50,47,0.08)] rounded-md bg-white"
                >
                  <option value="">همه زمان‌ها</option>
                  <option value="today">امروز</option>
                  <option value="week">این هفته</option>
                  <option value="month">این ماه</option>
                </select>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setDateFilter("");
                  }}
                  className="bg-[#37322F] hover:bg-[#37322F]/90"
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </div>

            {/* Orders Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">
                  همه ({filteredOrders.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  در انتظار (
                  {filteredOrders.filter((o) => o.status === "PENDING").length})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  تایید شده (
                  {
                    filteredOrders.filter((o) => o.status === "CONFIRMED")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="shipped">
                  ارسال شده (
                  {filteredOrders.filter((o) => o.status === "SHIPPED").length})
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  تحویل شده (
                  {
                    filteredOrders.filter((o) => o.status === "DELIVERED")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  لغو شده (
                  {
                    filteredOrders.filter((o) => o.status === "CANCELLED")
                      .length
                  }
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {getTabOrders(activeTab).map((order) => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-lg p-6 border cursor-pointer transition-colors ${
                      selectedOrder?.id === order.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-[rgba(55,50,47,0.08)] hover:bg-[rgba(55,50,47,0.02)]"
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-right flex-1">
                        <h3
                          dir="rtl"
                          className="text-lg font-semibold text-[#37322F] text-left gap-2"
                        >
                          سفارش <span>{order.id.slice(-8)}#</span>
                        </h3>
                        <p className="text-sm text-[#828387] text-left">
                          {order.user.name} ({order.user.email}) •{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`${getStatusColor(
                            order.status
                          )} flex items-center gap-1`}
                        >
                          {getStatusIcon(order.status)}
                          <span>
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
                          </span>
                        </Badge>
                        <span className="text-lg font-bold text-[#37322F]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#828387]">
                          به‌روزرسانی:{" "}
                          {new Date(order.updatedAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                        <span className="text-[#37322F] font-medium">
                          سرویس:{" "}
                          {order.orderItems
                            .map((item) => item.product.name)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {getTabOrders(activeTab).length === 0 && (
                  <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                    <ShoppingCart className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#37322F] mb-2">
                      سفارشی یافت نشد
                    </h3>
                    <p className="text-[#828387]">
                      هیچ سفارشی با فیلترهای فعلی شما مطابقت ندارد.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {selectedOrder ? (
              <>
                {/* Order Info */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <Package className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      جزئیات سفارش
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">
                        شناسه سفارش:
                      </span>
                      <span className="text-[#828387]">
                        #{selectedOrder.id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">وضعیت:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-[rgba(55,50,47,0.08)] rounded text-xs bg-white"
                      >
                        <option value="PENDING">در انتظار</option>
                        <option value="CONFIRMED">تایید شده</option>
                        <option value="SHIPPED">ارسال شده</option>
                        <option value="DELIVERED">تحویل شده</option>
                        <option value="CANCELLED">لغو شده</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          مجموع:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="999999999999.99"
                            step="0.01"
                            value={
                              Number(selectedOrder.total) > 0
                                ? Number(selectedOrder.total)
                                : ""
                            }
                            onChange={(e) =>
                              setSelectedOrder({
                                ...selectedOrder,
                                total: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="قیمت را وارد کنید"
                            className="px-2 py-1 border border-[rgba(55,50,47,0.08)] rounded text-xs bg-white w-32"
                          />
                          <span className="text-xs text-[#828387]">تومان</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="font-medium text-[#37322F]">
                          توضیحات:
                        </span>
                        <textarea
                          value={selectedOrder.description || ""}
                          onChange={(e) =>
                            setSelectedOrder({
                              ...selectedOrder,
                              description: e.target.value,
                            })
                          }
                          placeholder="توضیحات سفارش را وارد کنید..."
                          className="w-full px-3 py-2 border border-[rgba(55,50,47,0.08)] rounded text-sm bg-white resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">
                        ایجاد شده:
                      </span>
                      <span className="text-[#828387]">
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "fa-IR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">
                        به‌روزرسانی:
                      </span>
                      <span className="text-[#828387]">
                        {new Date(selectedOrder.updatedAt).toLocaleString(
                          "fa-IR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <User className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      مشتری
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">نام:</span>
                      <span className="text-[#828387]">
                        {selectedOrder.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#37322F]">ایمیل:</span>
                      <span className="text-[#828387]">
                        {selectedOrder.user.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <Package className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      آیتم‌های سفارش
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-[rgba(55,50,47,0.02)] rounded-lg"
                      >
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 text-right">
                          <p className="font-medium text-sm text-[#37322F]">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-[#828387]">
                            تعداد: {item.quantity}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm text-[#37322F]">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-xs text-[#828387]">
                            {formatPrice(Number(item.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-sm border border-[rgba(55,50,47,0.08)] rounded-lg text-[#828387] hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSaveOrder}
                    className="px-4 py-2 text-sm bg-[#37322F] text-white rounded-lg hover:bg-[#37322F]/90"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                <ShoppingCart className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#37322F] mb-2">
                  یک سفارش انتخاب کنید
                </h3>
                <p className="text-[#828387]">
                  یک سفارش از لیست انتخاب کنید تا جزئیات را مشاهده و وضعیت را
                  به‌روزرسانی کنید.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

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
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Crown,
  User,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  emailVerified: string | null;
  image: string | null;
  _count: {
    orders: number;
    tickets: number;
  };
  orders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="h-4 w-4" />;
      case "CUSTOMER":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getTabUsers = (tab: string) => {
    switch (tab) {
      case "customers":
        return filteredUsers.filter((u) => u.role === "CUSTOMER");
      case "admins":
        return filteredUsers.filter((u) => u.role === "ADMIN");
      case "verified":
        return filteredUsers.filter((u) => u.emailVerified);
      case "unverified":
        return filteredUsers.filter((u) => !u.emailVerified);
      default:
        return filteredUsers;
    }
  };

  const getTotalSpent = (user: User) => {
    return user.orders.reduce((sum, order) => sum + order.total, 0);
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
            مدیریت کاربران
          </h1>
          <p className="text-[#828387]">
            مدیریت حساب‌های کاربری، نقش‌ها و مجوزها
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <Users className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {users.length}
            </div>
            <div className="text-sm text-[#828387]">کل کاربران</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <User className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {users.filter((u) => u.role === "CUSTOMER").length}
            </div>
            <div className="text-sm text-[#828387]">مشتریان</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <Crown className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {users.filter((u) => u.role === "ADMIN").length}
            </div>
            <div className="text-sm text-[#828387]">مدیران</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)] shadow-[0px_0px_0px_1px_rgba(55,50,47,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                <UserCheck className="h-5 w-5 text-[#37322F]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#37322F] mb-1">
              {users.filter((u) => u.emailVerified).length}
            </div>
            <div className="text-sm text-[#828387]">تایید شده</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="جستجوی کاربران..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[rgba(55,50,47,0.08)]"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="cursor-pointer px-3 py-2 border border-[rgba(55,50,47,0.08)] rounded-md bg-white"
                >
                  <option value="">همه نقش‌ها</option>
                  <option value="CUSTOMER">مشتری</option>
                  <option value="ADMIN">مدیر</option>
                </select>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("");
                  }}
                  className="bg-[#37322F] hover:bg-[#37322F]/90"
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </div>

            {/* Users Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  همه ({filteredUsers.length})
                </TabsTrigger>
                <TabsTrigger value="customers">
                  مشتریان (
                  {filteredUsers.filter((u) => u.role === "CUSTOMER").length})
                </TabsTrigger>
                <TabsTrigger value="admins">
                  مدیران (
                  {filteredUsers.filter((u) => u.role === "ADMIN").length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  تایید شده (
                  {filteredUsers.filter((u) => u.emailVerified).length})
                </TabsTrigger>
                <TabsTrigger value="unverified">
                  تایید نشده (
                  {filteredUsers.filter((u) => !u.emailVerified).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {getTabUsers(activeTab).map((user) => (
                  <div
                    key={user.id}
                    className={`bg-white rounded-lg p-6 border cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-[rgba(55,50,47,0.08)] hover:bg-[rgba(55,50,47,0.02)]"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-left flex-1">
                        <p className="text-sm text-[#828387]">
                          {user.email} • عضویت{" "}
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <Badge
                        className={`${getRoleColor(
                          user.role
                        )} flex items-center gap-1`}
                      >
                        {getRoleIcon(user.role)}
                        <span> {user.role === "ADMIN" ? "مدیر" : "مشتری"}</span>
                      </Badge>
                      <h3 className="text-lg font-semibold text-[#37322F] flex items-center gap-2">
                        {user.name || "کاربر بدون نام"}
                        {user.emailVerified ? (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-gray-400" />
                        )}
                      </h3>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[#828387]">
                          {user._count.orders} سفارش
                        </span>
                        <ShoppingCart className="h-4 w-4 text-[#828387]" />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[#828387]">
                          {user._count.tickets} تیکت
                        </span>
                        <MessageSquare className="h-4 w-4 text-[#828387]" />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span dir="rtl" className="text-[#828387]">
                          {formatPrice(getTotalSpent(user))}
                        </span>
                        <DollarSign className="h-4 w-4 text-[#828387]" />
                      </div>
                    </div>
                  </div>
                ))}

                {getTabUsers(activeTab).length === 0 && (
                  <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                    <Users className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#37322F] mb-2">
                      کاربری یافت نشد
                    </h3>
                    <p className="text-[#828387]">
                      هیچ کاربری با فیلترهای فعلی شما مطابقت ندارد.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            {selectedUser ? (
              <>
                {/* User Info */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <User className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      جزئیات کاربر
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      {selectedUser.image ? (
                        <img
                          src={selectedUser.image}
                          alt={selectedUser.name || "User"}
                          className="w-16 h-16 rounded-full mx-auto mb-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[rgba(55,50,47,0.1)] flex items-center justify-center mx-auto mb-4">
                          <User className="h-8 w-8 text-[#828387]" />
                        </div>
                      )}
                      <h3 className="font-medium text-lg text-[#37322F]">
                        {selectedUser.name || "کاربر بدون نام"}
                      </h3>
                      <p className="text-sm text-[#828387]">
                        {selectedUser.email}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">نقش:</span>
                        <select
                          value={selectedUser.role}
                          onChange={(e) =>
                            handleUpdateUserRole(
                              selectedUser.id,
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border border-[rgba(55,50,47,0.08)] rounded text-xs bg-white"
                        >
                          <option value="CUSTOMER">مشتری</option>
                          <option value="ADMIN">مدیر</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          وضعیت:
                        </span>
                        <div className="flex items-center gap-1">
                          {selectedUser.emailVerified ? (
                            <>
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">تایید شده</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">تایید نشده</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          تاریخ عضویت:
                        </span>
                        <span className="text-[#828387]">
                          {new Date(selectedUser.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          سفارشات:
                        </span>
                        <span className="text-[#828387]">
                          {selectedUser._count.orders}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          تیکت‌ها:
                        </span>
                        <span className="text-[#828387]">
                          {selectedUser._count.tickets}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          مجموع خرید:
                        </span>
                        <span className="font-bold text-[#37322F]">
                          {formatPrice(getTotalSpent(selectedUser))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      سفارشات اخیر
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedUser.orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center p-3 bg-[rgba(55,50,47,0.02)] rounded-lg"
                      >
                        <div className="text-right">
                          <p className="font-medium text-sm text-[#37322F]">
                            سفارش #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-[#828387]">
                            {new Date(order.createdAt).toLocaleDateString(
                              "fa-IR"
                            )}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm text-[#37322F]">
                            {formatPrice(order.total)}
                          </p>
                          <Badge className={`${getStatusColor(order.status)}`}>
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
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {selectedUser.orders.length === 0 && (
                      <p className="text-center text-[#828387] py-4">
                        هنوز سفارشی وجود ندارد
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                <Users className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#37322F] mb-2">
                  یک کاربر انتخاب کنید
                </h3>
                <p className="text-[#828387]">
                  یک کاربر از لیست انتخاب کنید تا جزئیات را مشاهده و حساب کاربری
                  را مدیریت کنید.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

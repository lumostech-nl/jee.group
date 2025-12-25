"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  total: number;
  createdAt: string;
  orderItems: Array<{
    product: {
      name: string;
    };
  }>;
}

function NewTicketContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "MEDIUM",
    orderId: orderId || "none",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/auth/signin");
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?limit=100");
      if (response.ok) {
        const data = await response.json();
        // Show all orders regardless of their status
        setOrders(data.orders || data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً موضوع و توضیحات را پر کنید.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          orderId: formData.orderId === "none" ? null : formData.orderId,
        }),
      });

      if (response.ok) {
        toast({
          title: "تیکت ایجاد شد",
          description: "تیکت پشتیبانی شما با موفقیت ایجاد شد.",
          duration: 5000,
        });
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || errorData.error || "خطا در ایجاد تیکت";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error
            ? error.message
            : "خطا در ایجاد تیکت. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F3]">
        <div className="max-w-[1060px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[rgba(55,50,47,0.1)] rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-[rgba(55,50,47,0.05)] rounded-lg"></div>
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
            {/* Header Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[80px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[22px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    ایجاد تیکت پشتیبانی
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    برای هر سوال یا مشکلی، تیکت پشتیبانی ایجاد کنید
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full py-8 sm:py-12 md:py-16">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white border-[rgba(55,50,47,0.08)] shadow-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#37322F]">
                    تیکت جدید
                  </CardTitle>
                  <CardDescription className="text-[#828387]">
                    جزئیات مشکل یا سوال خود را شرح دهید
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Subject */}
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-[#37322F] text-right block"
                      >
                        موضوع *
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="موضوع تیکت را وارد کنید"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="text-right"
                        required
                      />
                    </div>

                    {/* Order Selection */}
                    <div className="space-y-2">
                      <label
                        htmlFor="orderId"
                        className="text-sm font-medium text-[#37322F] text-right block"
                      >
                        سفارش مرتبط (اختیاری)
                      </label>
                      <Select
                        value={formData.orderId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, orderId: value }))
                        }
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="سفارش را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">بدون سفارش مرتبط</SelectItem>
                          {orders.length > 0 ? (
                            orders.map((order) => (
                              <SelectItem key={order.id} value={order.id}>
                                سفارش #{order.id.slice(-8)} (
                                {order.status === "PENDING"
                                  ? "در انتظار"
                                  : order.status === "CONFIRMED"
                                  ? "تأیید شده"
                                  : order.status === "DELIVERED"
                                  ? "تحویل داده شده"
                                  : "لغو شده"}
                                ) -{" "}
                                {order.orderItems
                                  .map((item) => item.product.name)
                                  .join(", ")}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-orders" disabled>
                              هیچ سفارشی یافت نشد
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <label
                        htmlFor="priority"
                        className="text-sm font-medium text-[#37322F] text-right block"
                      >
                        اولویت
                      </label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">کم</SelectItem>
                          <SelectItem value="MEDIUM">متوسط</SelectItem>
                          <SelectItem value="HIGH">زیاد</SelectItem>
                          <SelectItem value="URGENT">فوری</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-[#37322F] text-right block"
                      >
                        توضیحات *
                      </label>
                      <Textarea
                        id="description"
                        placeholder="جزئیات مشکل یا سوال خود را شرح دهید..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="text-right min-h-[120px] resize-none"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1"
                      >
                        انصراف
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-[#37322F] hover:bg-[#37322F]/90"
                      >
                        {submitting ? (
                          "در حال ارسال..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 ml-2" />
                            ایجاد تیکت
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Help Section */}
              <div className="mt-8 bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                <h3 className="text-lg font-semibold text-[#37322F] mb-4 text-right">
                  راهنمای ایجاد تیکت
                </h3>
                <div className="space-y-3 text-sm text-[#828387] text-right">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[rgba(55,50,47,0.05)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[#37322F]">
                        1
                      </span>
                    </div>
                    <p>موضوع تیکت را به صورت خلاصه و واضح بنویسید</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[rgba(55,50,47,0.05)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[#37322F]">
                        2
                      </span>
                    </div>
                    <p>
                      در صورت مرتبط بودن، سفارش مربوطه را انتخاب کنید (تمام
                      سفارش‌ها قابل انتخاب هستند)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[rgba(55,50,47,0.05)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[#37322F]">
                        3
                      </span>
                    </div>
                    <p>اولویت تیکت را بر اساس اهمیت مشکل انتخاب کنید</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[rgba(55,50,47,0.05)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-[#37322F]">
                        4
                      </span>
                    </div>
                    <p>جزئیات کامل مشکل را در بخش توضیحات بنویسید</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PersianFooter />
    </div>
  );
}

export default function NewTicketPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#F7F5F3]">
          <div className="max-w-[1060px] mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-[rgba(55,50,47,0.1)] rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-[rgba(55,50,47,0.05)] rounded-lg"></div>
            </div>
          </div>
        </div>
      }
    >
      <NewTicketContent />
    </Suspense>
  );
}

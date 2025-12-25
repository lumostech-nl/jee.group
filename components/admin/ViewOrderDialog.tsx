"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Package,
  ShoppingCart,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

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

interface ViewOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "در انتظار";
      case "CONFIRMED":
        return "تایید شده";
      case "SHIPPED":
        return "ارسال شده";
      case "DELIVERED":
        return "تحویل داده شده";
      case "CANCELLED":
        return "لغو شده";
      default:
        return status;
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto pt-16 px-4 pb-4 sm:p-6"
        dir="rtl"
      >
        <DialogHeader className="space-y-2 sm:space-y-4 pb-4 sm:pb-6 border-b border-[rgba(55,50,47,0.08)]">
          <DialogTitle className="text-right text-lg sm:text-xl lg:text-2xl font-bold text-[#37322F] leading-tight">
            جزئیات سفارش #{order.id.slice(-8)}
          </DialogTitle>
          <DialogDescription className="text-right text-[#828387] text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span>
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>مجموع: {formatPrice(order.total)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-4 sm:pt-6">
          {/* Order Status and Info */}
          <div className="bg-[rgba(55,50,47,0.02)] p-4 sm:p-6 rounded-lg border border-[rgba(55,50,47,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Status Section */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#37322F] text-right mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  وضعیت سفارش
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      وضعیت:
                    </span>
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} text-sm py-1 px-3 self-start`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      شماره سفارش:
                    </span>
                    <span className="text-sm text-[#37322F] font-medium">
                      #{order.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#37322F] text-right mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  اطلاعات سفارش
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      تاریخ ثبت:
                    </span>
                    <span className="text-sm text-[#37322F]">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      تعداد اقلام:
                    </span>
                    <span className="text-sm text-[#37322F]">
                      {order.orderItems.length} محصول
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      مبلغ کل:
                    </span>
                    <span className="text-sm text-[#37322F] font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-[rgba(55,50,47,0.06)]">
            <h3 className="text-lg sm:text-xl font-semibold text-[#37322F] mb-4 sm:mb-6 text-right flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              اقلام سفارش
            </h3>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-[rgba(55,50,47,0.02)] rounded-lg border border-[rgba(55,50,47,0.06)] gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-[rgba(55,50,47,0.06)] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[rgba(55,50,47,0.05)] rounded-lg border border-[rgba(55,50,47,0.06)] flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 sm:h-8 sm:w-8 text-[#828387]" />
                      </div>
                    )}
                    <div className="text-right min-w-0 flex-1">
                      <h4 className="font-medium text-[#37322F] mb-1 text-sm sm:text-base truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#828387]">
                        تعداد: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right sm:ml-4">
                    <span className="text-sm sm:text-base font-medium text-[#37322F]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[rgba(55,50,47,0.06)]">
              <div className="bg-[rgba(55,50,47,0.02)] p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-base sm:text-lg font-semibold text-[#37322F] text-right">
                    مجموع نهایی:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-[#37322F] text-right">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions Guide */}
          <div className="bg-blue-50 border-2 border-blue-200 p-4 sm:p-5 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-lg sm:text-xl flex-shrink-0">
                💡
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-blue-800 font-semibold text-right mb-2 text-sm sm:text-base">
                  راهنمای سفارش:
                </h4>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-blue-700 text-right leading-relaxed">
                    • برای پیگیری سفارش خود می‌توانید از طریق شماره سفارش اقدام
                    کنید
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 text-right leading-relaxed">
                    • در صورت وجود مشکل، از بخش
                    <span className="font-semibold"> "تیکت جدید" </span>
                    برای ارتباط با پشتیبانی استفاده کنید
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 text-right leading-relaxed">
                    • کارشناسان ما بزودی با شما تماس خواهند گرفت
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;

"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  order?: {
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

interface ViewTicketDialogProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewTicketDialog: React.FC<ViewTicketDialogProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (isOpen && ticket) {
      fetchTicketMessages(ticket.id);
    } else {
      setTicketMessages([]);
    }
  }, [isOpen, ticket]);

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/tickets/${ticketId}/messages`);

      if (response.ok) {
        const data = await response.json();
        setTicketMessages(data.data || []);
      } else {
        console.error("Failed to fetch ticket messages");
        setTicketMessages([]);
      }
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      setTicketMessages([]);
    } finally {
      setLoadingMessages(false);
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

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto pt-16 px-4 pb-4 sm:p-6"
        dir="rtl"
      >
        <DialogHeader className="space-y-2 sm:space-y-4 pb-4 sm:pb-6 border-b border-[rgba(55,50,47,0.08)]">
          <DialogTitle className="text-right text-lg sm:text-xl lg:text-2xl font-bold text-[#37322F] leading-tight">
            جزئیات تیکت: {ticket.subject}
          </DialogTitle>
          <DialogDescription className="text-right text-[#828387] text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              {ticket.order && (
                <>
                  <span>سفارش #{ticket.order.id.slice(-8)}</span>
                  <span className="hidden sm:inline">•</span>
                </>
              )}
              <span>
                {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-4 sm:pt-6">
          {/* Ticket Status and Info */}
          <div className="bg-[rgba(55,50,47,0.02)] p-4 sm:p-6 rounded-lg border border-[rgba(55,50,47,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Status Section */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#37322F] text-right mb-3">
                  وضعیت تیکت
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      وضعیت:
                    </span>
                    <Badge
                      className={`${getTicketStatusColor(
                        ticket.status
                      )} text-sm px-3 py-1 self-start`}
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
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      اولویت:
                    </span>
                    <Badge
                      className={`${getPriorityColor(
                        ticket.priority
                      )} text-sm px-3 py-1 self-start`}
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
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#37322F] text-right mb-3">
                  اطلاعات کلی
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      تاریخ ایجاد:
                    </span>
                    <span className="text-sm text-[#37322F]">
                      {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  {ticket.order && (
                    <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                      <span className="text-sm text-[#828387] text-right">
                        شماره سفارش:
                      </span>
                      <span className="text-sm text-[#37322F]">
                        #{ticket.order.id.slice(-8)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
                    <span className="text-sm text-[#828387] text-right">
                      تعداد پیام‌ها:
                    </span>
                    <span className="text-sm text-[#37322F]">
                      {ticket.updates.length} پیام
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {ticket.description && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[rgba(55,50,47,0.06)]">
                <h4 className="text-base sm:text-lg font-semibold text-[#37322F] mb-3 text-right">
                  توضیحات اولیه:
                </h4>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-[rgba(55,50,47,0.06)]">
                  <p className="text-xs sm:text-sm text-[#37322F] text-right whitespace-pre-wrap leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-[rgba(55,50,47,0.06)]">
            <h3 className="text-lg sm:text-xl font-semibold text-[#37322F] mb-4 sm:mb-6 text-right">
              پیام‌های پشتیبانی
            </h3>

            {loadingMessages ? (
              <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#37322F]"></div>
                <span className="text-sm sm:text-base text-[#828387] text-center">
                  در حال بارگذاری پیام‌ها...
                </span>
              </div>
            ) : ticketMessages.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-[rgba(55,50,47,0.02)] rounded-lg">
                <div className="text-[#828387] mb-2">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                </div>
                <p className="text-[#828387] text-base sm:text-lg px-4">
                  هنوز پیامی ارسال نشده است
                </p>
                <p className="text-[#828387] text-xs sm:text-sm mt-2 px-4">
                  پیام‌های تیم پشتیبانی در اینجا نمایش داده خواهد شد
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2">
                {ticketMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 sm:p-5 rounded-lg border-2 ${
                      message.user.role === "ADMIN"
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <div className="flex items-center gap-2 order-2 sm:order-1">
                        <span className="text-xs text-[#828387] bg-white px-2 py-1 rounded">
                          {new Date(message.createdAt).toLocaleString("fa-IR")}
                        </span>
                      </div>
                      <div className="text-right order-1 sm:order-2">
                        <span className="text-sm font-semibold text-[#37322F]">
                          {message.user.name}
                          {message.user.role === "ADMIN" && (
                            <span className="text-blue-700 mr-2 font-bold text-xs sm:text-sm">
                              (تیم پشتیبانی)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-[rgba(55,50,47,0.06)]">
                      <p className="text-xs sm:text-sm text-[#37322F] text-right whitespace-pre-wrap leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Note for user */}
          <div className="bg-amber-50 border-2 border-amber-200 p-4 sm:p-5 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 text-lg sm:text-xl flex-shrink-0">
                📝
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-amber-800 font-semibold text-right mb-2 text-sm sm:text-base">
                  راهنما:
                </h4>
                <p className="text-xs sm:text-sm text-amber-700 text-right leading-relaxed">
                  در این بخش فقط می‌توانید پیام‌های ارسالی توسط تیم پشتیبانی را
                  مشاهده کنید. برای ارسال پیام جدید یا ایجاد تیکت جدید، لطفاً از
                  <span className="font-semibold"> بخش "تیکت جدید" </span>
                  استفاده کنید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTicketDialog;

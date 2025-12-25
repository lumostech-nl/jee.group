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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/AdminLayout";
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Clock,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    status: string;
    total: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  updates: Array<{
    id: string;
    message: string;
    isInternal: boolean;
    createdAt: string;
    user: {
      name: string;
      role: string;
    };
  }>;
}

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isPostingMessage, setIsPostingMessage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchTickets();
  }, [session, status]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        let message = "خطا در دریافت تیکت‌ها";
        try {
          const err = await response.json();
          message = err?.message || err?.error || message;
        } catch {}
        toast({
          title: "عدم موفقیت",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "خطا",
        description: "دریافت لیست تیکت‌ها با مشکل مواجه شد.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    newStatus: string
  ) => {
    try {
      setStatusUpdatingId(ticketId);
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
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
        toast({
          title: "وضعیت بروزرسانی شد",
          description: "وضعیت تیکت با موفقیت تغییر کرد.",
        });
      } else {
        let message = "تغییر وضعیت تیکت ناموفق بود";
        try {
          const err = await response.json();
          message = err?.message || err?.error || message;
        } catch {}
        toast({
          title: "عدم موفقیت",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "خطا",
        description: "بروزرسانی وضعیت تیکت با مشکل مواجه شد.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleAddMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return;

    try {
      setIsPostingMessage(true);
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          isInternal,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setIsInternal(false);
        // Refresh the selected ticket
        if (selectedTicket?.id === ticketId) {
          const ticketResponse = await fetch(`/api/tickets/${ticketId}`);
          if (ticketResponse.ok) {
            const ticketData = await ticketResponse.json();
            setSelectedTicket(ticketData);
          }
        }
        fetchTickets();
        toast({
          title: "پیام ثبت شد",
          description: isInternal
            ? "یادداشت داخلی افزوده شد."
            : "پاسخ شما ارسال شد.",
        });
      } else {
        let message = "ارسال پیام ناموفق بود";
        try {
          const err = await response.json();
          message = err?.message || err?.error || message;
        } catch {}
        toast({
          title: "عدم موفقیت",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding message:", error);
      toast({
        title: "خطا",
        description: "ارسال پیام با مشکل مواجه شد.",
        variant: "destructive",
      });
    } finally {
      setIsPostingMessage(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      case "CLOSED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.user?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (ticket.user?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority =
      !priorityFilter || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTabTickets = (tab: string) => {
    switch (tab) {
      case "open":
        return filteredTickets.filter((t) => t.status === "OPEN");
      case "in-progress":
        return filteredTickets.filter((t) => t.status === "IN_PROGRESS");
      case "resolved":
        return filteredTickets.filter((t) => t.status === "RESOLVED");
      case "closed":
        return filteredTickets.filter((t) => t.status === "CLOSED");
      default:
        return filteredTickets;
    }
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
            مدیریت تیکت‌ها
          </h1>
          <p className="text-[#828387]">
            مدیریت تیکت‌های پشتیبانی مشتریان و پاسخ‌ها
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
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
                  placeholder="جستجوی تیکت‌ها..."
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
                  <option value="OPEN">باز</option>
                  <option value="IN_PROGRESS">در حال انجام</option>
                  <option value="RESOLVED">حل شده</option>
                  <option value="CLOSED">بسته شده</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-[rgba(55,50,47,0.08)] rounded-md bg-white"
                >
                  <option value="">همه اولویت‌ها</option>
                  <option value="LOW">کم</option>
                  <option value="MEDIUM">متوسط</option>
                  <option value="HIGH">بالا</option>
                  <option value="URGENT">فوری</option>
                </select>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPriorityFilter("");
                  }}
                  className="bg-[#37322F] hover:bg-[#37322F]/90"
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </div>

            {/* Tickets Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  همه ({filteredTickets.length})
                </TabsTrigger>
                <TabsTrigger value="open">
                  باز (
                  {filteredTickets.filter((t) => t.status === "OPEN").length})
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  در حال انجام (
                  {
                    filteredTickets.filter((t) => t.status === "IN_PROGRESS")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  حل شده (
                  {
                    filteredTickets.filter((t) => t.status === "RESOLVED")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="closed">
                  بسته شده (
                  {filteredTickets.filter((t) => t.status === "CLOSED").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent dir="rtl" value={activeTab} className="space-y-4">
                {getTabTickets(activeTab).map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-lg p-6 border cursor-pointer transition-colors dir="rtl" ${
                      selectedTicket?.id === ticket.id
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-[rgba(55,50,47,0.08)] hover:bg-[rgba(55,50,47,0.02)]"
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2 text-right">
                        <p className="text-sm text-[#828387]">
                          {ticket.order
                            ? `سفارش #${ticket.order.id.slice(-8)} • `
                            : ""}
                          {ticket.user?.name || "کاربر نامشخص"} (
                          {ticket.user?.email || "ایمیل نامشخص"})
                        </p>
                        <span className="flex items-center gap-2">
                          <Badge
                            className={`${getStatusColor(
                              ticket.status
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(ticket.status)}
                            <span>
                              {ticket.status === "OPEN"
                                ? "باز"
                                : ticket.status === "IN_PROGRESS"
                                ? "در حال انجام"
                                : ticket.status === "RESOLVED"
                                ? "حل شده"
                                : ticket.status === "CLOSED"
                                ? "بسته شده"
                                : ticket.status}
                            </span>
                          </Badge>
                          <Badge
                            className={`${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority === "LOW"
                              ? "کم"
                              : ticket.priority === "MEDIUM"
                              ? "متوسط"
                              : ticket.priority === "HIGH"
                              ? "بالا"
                              : ticket.priority === "URGENT"
                              ? "فوری"
                              : ticket.priority}
                          </Badge>
                        </span>
                        <h3 className="text-lg font-semibold text-[#37322F] text-right">
                          {ticket.subject}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-[#828387] line-clamp-2 text-right">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-[#828387]">
                        <span className="text-right">
                          {ticket.updates.length} پیام
                        </span>
                        <span>
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {getTabTickets(activeTab).length === 0 && (
                  <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                    <MessageSquare className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#37322F] mb-2">
                      تیکتی یافت نشد
                    </h3>
                    <p className="text-[#828387]">
                      هیچ تیکتی با فیلترهای فعلی شما مطابقت ندارد.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Details */}
          <div className="space-y-6">
            {selectedTicket ? (
              <>
                {/* Ticket Info */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <MessageSquare className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      جزئیات تیکت
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-[#37322F]">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-sm text-[#828387] mt-1">
                        {selectedTicket.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          وضعیت:
                        </span>
                        <select
                          value={selectedTicket.status}
                          onChange={(e) =>
                            handleUpdateTicketStatus(
                              selectedTicket.id,
                              e.target.value
                            )
                          }
                          className="px-2 py-1 border border-[rgba(55,50,47,0.08)] rounded text-xs bg-white"
                          disabled={statusUpdatingId === selectedTicket.id}
                        >
                          <option value="OPEN">باز</option>
                          <option value="IN_PROGRESS">در حال انجام</option>
                          <option value="RESOLVED">حل شده</option>
                          <option value="CLOSED">بسته شده</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#37322F]">
                          اولویت:
                        </span>
                        <Badge
                          className={`${getPriorityColor(
                            selectedTicket.priority
                          )}`}
                        >
                          {selectedTicket.priority === "LOW"
                            ? "کم"
                            : selectedTicket.priority === "MEDIUM"
                            ? "متوسط"
                            : selectedTicket.priority === "HIGH"
                            ? "بالا"
                            : selectedTicket.priority === "URGENT"
                            ? "فوری"
                            : selectedTicket.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-[#37322F]">
                          مشتری:
                        </span>
                        <span className="text-[#828387]">
                          {selectedTicket.user?.name || "کاربر نامشخص"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-[#37322F]">
                          ایمیل:
                        </span>
                        <span className="text-[#828387]">
                          {selectedTicket.user?.email || "ایمیل نامشخص"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-[#37322F]">
                          سفارش:
                        </span>
                        <span className="text-[#828387]">
                          {selectedTicket.order
                            ? `#${selectedTicket.order.id.slice(-8)}`
                            : "بدون سفارش مرتبط"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-[#37322F]">
                          ایجاد شده:
                        </span>
                        <span className="text-[#828387]">
                          {new Date(selectedTicket.createdAt).toLocaleString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="bg-white rounded-lg p-6 border border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[rgba(55,50,47,0.05)] rounded-lg">
                      <MessageCircle className="h-5 w-5 text-[#37322F]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#37322F]">
                      پیام‌ها ({selectedTicket.updates.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedTicket.updates.map((update) => (
                        <div
                          key={update.id}
                          className={`p-3 rounded-lg ${
                            update.isInternal
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-[rgba(55,50,47,0.02)] border border-[rgba(55,50,47,0.08)]"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm text-[#37322F]">
                              {update.user.name}{" "}
                              {update.isInternal && "(داخلی)"}
                            </span>
                            <span className="text-xs text-[#828387]">
                              {new Date(update.createdAt).toLocaleString(
                                "fa-IR"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-[#37322F]">
                            {update.message}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Message */}
                    <div className="space-y-3">
                      <Textarea
                        placeholder="پاسخ خود را تایپ کنید..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="border-[rgba(55,50,47,0.08)]"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="internal"
                          checked={isInternal}
                          onChange={(e) => setIsInternal(e.target.checked)}
                          className="rounded"
                        />
                        <label
                          htmlFor="internal"
                          className="text-sm text-[#828387]"
                        >
                          یادداشت داخلی (برای مشتری قابل مشاهده نیست)
                        </label>
                      </div>
                      <Button
                        onClick={() => handleAddMessage(selectedTicket.id)}
                        disabled={!newMessage.trim() || isPostingMessage}
                        className="w-full bg-[#37322F] hover:bg-[#37322F]/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isPostingMessage ? "در حال ارسال..." : "افزودن پیام"}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 border border-[rgba(55,50,47,0.08)] text-center">
                <MessageSquare className="h-12 w-12 text-[#828387] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#37322F] mb-2">
                  یک تیکت انتخاب کنید
                </h3>
                <p className="text-[#828387]">
                  یک تیکت از لیست انتخاب کنید تا جزئیات را مشاهده و پاسخ دهید.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

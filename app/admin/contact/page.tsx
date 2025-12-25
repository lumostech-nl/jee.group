'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MessageSquare, Mail, Phone, Calendar, Search, Eye, CheckCircle, Clock, XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export default function ContactAdminPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user.role !== 'ADMIN') {
      redirect('/')
    }
    
    fetchMessages()
  }, [session, status])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus as any } : msg
        ))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus as any })
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="default" className="bg-blue-500">جدید</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="secondary" className="bg-yellow-500">در حال بررسی</Badge>
      case 'RESOLVED':
        return <Badge variant="outline" className="bg-green-500 text-white">حل شده</Badge>
      case 'CLOSED':
        return <Badge variant="destructive">بسته شده</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Clock className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <Eye className="h-4 w-4" />
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4" />
      case 'CLOSED':
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || message.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#37322F]">پیام‌های تماس</h1>
            <p className="text-[#605A57]">مدیریت و پاسخگویی به پیام‌های دریافتی</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605A57]">کل پیام‌ها</p>
                  <p className="text-2xl font-bold text-[#37322F]">{messages.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-[#92B2B0]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605A57]">پیام‌های جدید</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {messages.filter(m => m.status === 'NEW').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605A57]">در حال بررسی</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {messages.filter(m => m.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#605A57]">حل شده</p>
                  <p className="text-2xl font-bold text-green-600">
                    {messages.filter(m => m.status === 'RESOLVED').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#605A57] h-4 w-4" />
                  <Input
                    placeholder="جستجو در نام، ایمیل یا موضوع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className={filterStatus === status ? 'bg-[#37322F]' : ''}
                  >
                    {status === 'ALL' ? 'همه' :
                     status === 'NEW' ? 'جدید' :
                     status === 'IN_PROGRESS' ? 'در حال بررسی' :
                     status === 'RESOLVED' ? 'حل شده' : 'بسته شده'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <Card>
            <CardHeader>
              <CardTitle>لیست پیام‌ها</CardTitle>
              <CardDescription>
                {filteredMessages.length} پیام از {messages.length} پیام کل
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-[#92B2B0]/10 border-[#92B2B0]' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-[#37322F] text-right">{message.name}</h3>
                        <p className="text-sm text-[#605A57] text-right">{message.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(message.status)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#605A57]">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="p-8 text-center text-[#605A57]">
                    هیچ پیامی یافت نشد
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Details */}
          <Card>
            <CardHeader>
              <CardTitle>جزئیات پیام</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-6">
                  {/* Message Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#605A57]">نام</label>
                      <p className="text-[#37322F] text-right">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#605A57]">ایمیل</label>
                      <p className="text-[#37322F] text-right">{selectedMessage.email}</p>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <label className="text-sm font-medium text-[#605A57]">تلفن</label>
                        <p className="text-[#37322F] text-right">{selectedMessage.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-[#605A57]">موضوع</label>
                      <p className="text-[#37322F] text-right">{selectedMessage.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#605A57]">پیام</label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-[#37322F] text-right whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#605A57]">تاریخ ارسال</label>
                      <p className="text-[#37322F] text-right">
                        {new Date(selectedMessage.createdAt).toLocaleString('fa-IR')}
                      </p>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[#605A57]">تغییر وضعیت</label>
                    <div className="flex flex-wrap gap-2">
                      {['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                        <Button
                          key={status}
                          variant={selectedMessage.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMessageStatus(selectedMessage.id, status)}
                          className={selectedMessage.status === status ? 'bg-[#37322F]' : ''}
                        >
                          {getStatusIcon(status)}
                          <span className="mr-1">
                            {status === 'NEW' ? 'جدید' :
                             status === 'IN_PROGRESS' ? 'در حال بررسی' :
                             status === 'RESOLVED' ? 'حل شده' : 'بسته شده'}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-[#605A57]">عملیات سریع</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                      >
                        <Mail className="h-4 w-4 ml-1" />
                        پاسخ ایمیل
                      </Button>
                      {selectedMessage.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${selectedMessage.phone}`)}
                        >
                          <Phone className="h-4 w-4 ml-1" />
                          تماس تلفنی
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#605A57] py-8">
                  پیامی را برای مشاهده جزئیات انتخاب کنید
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

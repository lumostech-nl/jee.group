'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquare, Send, Clock } from 'lucide-react'
import { PersianHeader } from '@/components/persian-header'
import { PersianFooter } from '@/components/persian-footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'خطا در ارسال پیام')
      }
    } catch (error) {
      setError('خطایی در ارسال پیام رخ داد')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (success) {
    return (
      <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
        <PersianHeader />
        
        <div className="relative flex flex-col justify-start items-center w-full">
          <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
            <div className="self-stretch pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[600px] lg:w-[600px] flex flex-col justify-center items-center gap-6">
                <Card className="w-full">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#37322F] mb-2">پیام ارسال شد!</h2>
                    <p className="text-[#605A57] mb-6">
                      از تماس شما متشکریم. پیام شما دریافت شد و در کمتر از ۲۴ ساعت پاسخ خواهیم داد.
                    </p>
                    <Button 
                      onClick={() => setSuccess(false)}
                      className="bg-[#37322F] hover:bg-[#37322F]/90 text-white"
                    >
                      ارسال پیام جدید
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <PersianFooter />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <PersianHeader />
      
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          <div className="self-stretch pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
            
            {/* Header Section */}
            <div className="w-full max-w-[800px] lg:w-[800px] text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#37322F] mb-4 font-serif">
                تماس با ما
              </h1>
              <p className="text-[#605A57] text-lg leading-relaxed">
                سوالی دارید یا به کمک نیاز دارید؟ ما اینجا هستیم تا به شما کمک کنیم. 
                پیام خود را ارسال کنید و در کمتر از ۲۴ ساعت پاسخ خواهیم داد.
              </p>
            </div>

            {/* Contact Form */}
            <div className="w-full max-w-[600px] lg:w-[600px] mb-12">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#37322F]">
                    <MessageSquare className="h-5 w-5" />
                    ارسال پیام
                  </CardTitle>
                  <CardDescription className="text-[#605A57]">
                    فرم زیر را پر کنید و ما در کمتر از ۲۴ ساعت پاسخ خواهیم داد.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-right">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#37322F] mb-2 text-right">
                          نام و نام خانوادگی *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="نام و نام خانوادگی خود را وارد کنید"
                          className="text-right"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 text-right">
                          آدرس ایمیل *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="آدرس ایمیل خود را وارد کنید"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#37322F] mb-2 text-right">
                        شماره تلفن (اختیاری)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="شماره تلفن خود را وارد کنید"
                        className="text-right"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-[#37322F] mb-2 text-right">
                        موضوع *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="موضوع پیام خود را وارد کنید"
                        className="text-right"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[#37322F] mb-2 text-right">
                        پیام *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="پیام خود را اینجا بنویسید..."
                        className="text-right"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#37322F] hover:bg-[#37322F]/90 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 ml-2" />
                          ارسال پیام
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="w-full max-w-[800px] lg:w-[800px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#92B2B0]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-[#92B2B0]" />
                  </div>
                  <h3 className="font-medium text-[#37322F] mb-1">ایمیل ما</h3>
                  <p className="text-sm text-[#605A57]">info@jee.group</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#92B2B0]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-[#92B2B0]" />
                  </div>
                  <h3 className="font-medium text-[#37322F] mb-1">ساعات پاسخگویی</h3>
                  <p className="text-sm text-[#605A57]">شنبه تا پنج‌شنبه ۹ تا ۱۷</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PersianFooter />
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { PersianHeader } from '@/components/persian-header'
import { PersianFooter } from '@/components/persian-footer'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError('ایمیل برای ورود کانفیگ نشده است. لطفاً با گوگل وارد شوید.')
      } else {
        setError('')
        alert('لطفاً ایمیل خود را برای دریافت لینک ورود چک کنید!')
      }
    } catch (error) {
      setError('ایمیل برای ورود کانفیگ نشده است. لطفاً با گوگل وارد شوید.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      setError('Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <PersianHeader />

      <div className="relative flex flex-col justify-start items-center w-full flex-1">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
          {/* Left vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="w-full max-w-md mx-auto relative z-10">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-[#37322F] text-3xl md:text-4xl font-bold leading-tight font-serif mb-4">
                ورود به حساب کاربری
              </h1>
              <p className="text-[#605A57] text-sm md:text-base leading-relaxed font-sans">
                یا{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="font-medium text-[#37322F] hover:text-[#37322F]/80 underline transition-colors"
                >
                  حساب جدید بسازید
                </button>
              </p>
            </div>

            {/* Auth Card */}
            <Card className="bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] border-[rgba(55,50,47,0.06)] rounded-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-[#37322F] text-xl font-semibold font-sans">ورود</CardTitle>
                <CardDescription className="text-[#605A57] text-sm font-sans">
                  روش ورود مورد نظر خود را انتخاب کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-sans">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-50 text-[#37322F] border border-[rgba(55,50,47,0.12)] shadow-sm font-medium font-sans"
                  variant="outline"
                >
                  {(React.createElement as any)(FcGoogle, { className: "h-4 w-4 ml-2" })}
                  ادامه با گوگل
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[rgba(55,50,47,0.12)]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#605A57] font-sans">
                      یا با ایمیل ادامه دهید
                    </span>
                  </div>
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#37322F] mb-2 font-sans">
                      آدرس ایمیل
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#605A57]" size={20} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 text-right font-sans border-[rgba(55,50,47,0.12)] focus:border-[#37322F] focus:ring-[#37322F]"
                        placeholder="ایمیل خود را وارد کنید"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#37322F] hover:bg-[#37322F]/90 text-white font-medium font-sans"
                  >
                    {loading ? 'در حال ارسال...' : 'ارسال لینک ورود'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="text-center mt-6">
              <p className="text-[#605A57] text-xs font-sans">
                با ورود به حساب کاربری، با{' '}
                <a href="/terms" className="underline hover:text-[#37322F] transition-colors">
                  شرایط استفاده
                </a>{' '}
                و{' '}
                <a href="/privacy" className="underline hover:text-[#37322F] transition-colors">
                  حریم خصوصی
                </a>{' '}
                موافقت می‌کنید.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PersianFooter />
    </div>
  )
}

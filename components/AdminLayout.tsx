'use client'

import { ReactNode } from 'react'
import { PersianHeader } from '@/components/persian-header'
import { PersianFooter } from '@/components/persian-footer'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] overflow-x-hidden">
      <PersianHeader />

      <div className="pt-16 min-h-screen">
        <div className="relative flex flex-col justify-start items-center w-full">
          <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">

            <div className="self-stretch pt-8 pb-8 flex flex-col justify-start items-center px-4 sm:px-6 md:px-8 lg:px-0 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>

      <PersianFooter />
    </div>
  )
}


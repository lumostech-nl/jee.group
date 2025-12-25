import { redirect } from 'next/navigation'
import { requireAuth, canManageCategories } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { CategoriesManager } from '@/components/cms/categories-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ArrowLeft, FolderOpen } from 'lucide-react'
import Link from 'next/link'

export default async function CMSCategoriesPage() {
  const user = await requireAuth()

  if (!canManageCategories(user.role)) {
    redirect('/cms')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/cms">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">مدیریت دسته‌بندی‌ها</h1>
              <p className="text-gray-600 mt-2">
                دسته‌بندی‌های وبلاگ را برای سازماندهی بهتر محتوا مدیریت کنید
              </p>
            </div>
          </div>
        </div>

        {/* Categories Management */}
        <CategoriesManager />
      </div>
    </AdminLayout>
  )
}

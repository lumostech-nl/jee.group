import { redirect } from 'next/navigation'
import { requireAuth, canManageCategories } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { TagsManager } from '@/components/cms/tags-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Tags } from 'lucide-react'
import Link from 'next/link'

export default async function CMSTagsPage() {
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">مدیریت برچسب‌ها</h1>
              <p className="text-gray-600 mt-2">
                برچسب‌های وبلاگ را برای بهبود طبقه‌بندی و جستجو مدیریت کنید
              </p>
            </div>
          </div>
        </div>

        {/* Tags Management */}
        <TagsManager />
      </div>
    </AdminLayout>
  )
}

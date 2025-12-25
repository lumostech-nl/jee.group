import { requireAuth } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { AnalyticsDashboard } from '@/components/cms/analytics-dashboard'

export default async function AnalyticsPage() {
  const user = await requireAuth()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">تحلیل‌ها</h1>
          <p className="text-muted-foreground">
            عملکرد وبلاگ، تعامل و معیارهای رشد خود را پیگیری کنید.
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}

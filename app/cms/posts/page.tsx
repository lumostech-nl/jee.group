import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { PostsTable } from '@/components/cms/posts-table'
import { PostsFilter } from '@/components/cms/posts-filter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, PlusCircle, Calendar, Users, Archive } from 'lucide-react'
import Link from 'next/link'

export default async function CMSPostsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await requireAuth()

  const page = parseInt(searchParams.page as string || '1')  
  const search = searchParams.search as string || ''
  const status = searchParams.status as string || 'all'
  const category = searchParams.category as string || 'all'
  const author = searchParams.author as string || 'all'

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">مدیریت پست‌ها</h1>
            <p className="text-gray-600 mt-2">
              پست‌های موجود در سیستم را مدیریت و ویرایش کنید
            </p>
          </div>
          <Link href="/cms/posts/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              پست جدید
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">پست‌های جدید</CardTitle>
              <PlusCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Link href="/cms/posts/new">
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  ایجاد پست
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">پیش‌نویس‌ها</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <Link href="/cms/posts?status=DRAFT">
                <Button variant="outline" className="w-full">
                  مدیریت پیش‌نویس‌ها
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">پست‌های منتشر شده</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <Link href="/cms/posts?status=PUBLISHED">
                <Button variant="outline" className="w-full">
                  مشاهده منتشر شده‌ها
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">آرشیو</CardTitle>
              <Archive className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <Link href="/cms/posts?status=ARCHIVED">
                <Button variant="outline" className="w-full">
                  پست‌های آرشیو شده
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>فیلترها و جستجو</CardTitle>
          </CardHeader>
          <CardContent>
            <PostsFilter 
              currentStatus={status}
              currentCategory={category}
              currentAuthor={author}
              currentSearch={search}
              userRole={user.role}
            />
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>لیست پست‌ها</CardTitle>
            <CardDescription>
              مدیریت و ویرایش پست‌های وبلاگ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostsTable 
              page={page}
              search={search}
              status={status}
              category={category}
              author={author}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
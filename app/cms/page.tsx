import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, FileText, Image, Users, BarChart3, Settings, TrendingUp, TrendingDown, Plus, Eye, FolderOpen, Activity } from 'lucide-react'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function CMSPage() {
  const user = await requireAuth()

  const stats = await getCMSStats()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">سیستم مدیریت محتوا</h1>
            <p className="text-slate-300 text-lg">
              محتوای وبلاگ، رسانه و تحلیل‌های خود را از یک مکان مرکزی مدیریت کنید
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">مجموع پست‌ها</CardTitle>
              <div className="p-2 bg-slate-600 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 text-slate-900">{stats.totalPosts}</div>
              <p className="text-xs text-slate-600">
                {stats.publishedPosts} منتشر شده
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">دسته‌بندی‌ها</CardTitle>
              <div className="p-2 bg-slate-600 rounded-lg">
                <FolderOpen className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 text-slate-900">{stats.totalCategories}</div>
              <p className="text-xs text-slate-600">
                {stats.activeCategories} فعال
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">فایل‌های رسانه</CardTitle>
              <div className="p-2 bg-slate-600 rounded-lg">
                <Image className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 text-slate-900">{stats.totalMedia}</div>
              <p className="text-xs text-slate-600">
                {stats.totalSize}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">مجموع بازدیدها</CardTitle>
              <div className="p-2 bg-slate-600 rounded-lg">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 text-slate-900">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-slate-600">
                این ماه
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">دسترسی سریع</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <Link href="/cms/posts">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-600 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                    مدیریت پست‌ها
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    مشاهده، ویرایش و مدیریت تمام پست‌های وبلاگ
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <Link href="/cms/posts/new">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-600 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                    پست جدید
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    ایجاد پست جدید وبلاگ با ویرایشگر متن غنی
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <Link href="/cms/media">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-600 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                    کتابخانه رسانه
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    آپلود و مدیریت تصاویر، ویدیوها و اسناد
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <Link href="/cms/categories">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-600 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                    دسته‌بندی‌ها و برچسب‌ها
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    محتوای خود را با دسته‌بندی‌ها و برچسب‌ها سازماندهی کنید
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <Link href="/cms/analytics">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-600 rounded-xl group-hover:bg-slate-700 transition-colors">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 mb-2">
                    تحلیل‌ها
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    عملکرد وبلاگ و معیارهای تعامل را مشاهده کنید
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">پست‌های اخیر</h2>
          <Card className="border border-slate-200 bg-slate-50">
            <CardHeader className="pb-4">
              <CardDescription className="text-slate-600">
                آخرین پست‌های منتشر شده و پیش‌نویس شما
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">
                      هنوز پستی وجود ندارد
                    </p>
                    <p className="text-sm text-slate-400">
                      اولین پست خود را ایجاد کنید تا شروع کنید!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentPosts.map((post: any) => (
                      <div key={post.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className={`w-3 h-3 rounded-full ${post.status === 'PUBLISHED' ? 'bg-slate-600' : 'bg-slate-400'}`}></div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-slate-600 transition-colors">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <CalendarDays className="h-3 w-3" />
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : 'پیش‌نویس'}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          className={`${post.status === 'PUBLISHED' ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                          {post.status === 'PUBLISHED' ? 'منتشر شده' : 'پیش‌نویس'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

async function getCMSStats() {
  const [totalPosts, publishedPosts, totalCategories, activeCategories, totalMedia, totalViewsData, recentPosts] = await Promise.all([
    // Total posts count
    prisma.blogPost.count(),
    
    // Published posts count  
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    
    // Total categories count
    prisma.category.count(),
    
    // Active categories count
    prisma.category.count({ where: { isActive: true } }),
    
    // Total media count
    prisma.blogMedia.count(),
    
    // Total views (sum of all viewCount)
    prisma.blogPost.aggregate({
      _sum: { viewCount: true }
    }),
    
    // Recent posts (last 5)
    prisma.blogPost.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  // Calculate total size of media files
  const mediaSizeData = await prisma.blogMedia.aggregate({
    _sum: { size: true }
  })
  
  const totalSizeInBytes = mediaSizeData._sum.size || 0
  const totalSize = formatFileSize(totalSizeInBytes)

  return {
    totalPosts,
    publishedPosts,
    totalCategories,
    activeCategories,
    totalMedia,
    totalSize,
    totalViews: totalViewsData._sum.viewCount || 0,
    recentPosts: recentPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      status: post.status,
      publishedAt: post.publishedAt
    }))
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

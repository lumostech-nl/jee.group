import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Clock, User } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

interface Tag {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

interface RecentPost {
  id: string
  title: string
  slug: string
  publishedAt: Date
}

interface BlogSidebarProps {
  categories: Category[]
  tags: Tag[]
  recentPosts: RecentPost[]
  currentCategory?: string
  currentTag?: string
  search?: string
}

export function BlogSidebar({
  categories,
  tags,
  recentPosts,
  currentCategory,
  currentTag,
  search
}: BlogSidebarProps) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Search className="h-5 w-5" />
            جستجو
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-2">
            <Input
              placeholder="جستجو در پست‌ها..."
              defaultValue={search}
              name="search"
              className="text-right"
            />
            <Button type="submit" className="w-full">
              جستجو
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">دسته‌بندی‌ها</CardTitle>
          <CardDescription className="text-right">
            مرور پست‌ها بر اساس دسته‌بندی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Link
              href="/blog"
              className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors ${
                !currentCategory ? 'bg-muted' : ''
              }`}
              dir="rtl"
            >
              <Badge variant="secondary">
                {categories.reduce((acc, cat) => acc + cat._count.posts, 0)}
              </Badge>
              <span className="text-right flex-1 ml-2">همه دسته‌بندی‌ها</span>
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors ${
                  currentCategory === category.slug ? 'bg-muted' : ''
                }`}
                dir="rtl"
              >
                <Badge variant="outline">{category._count.posts}</Badge>
                <span className="text-right flex-1 ml-2">{category.name}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">برچسب‌های محبوب</CardTitle>
          <CardDescription className="text-right">
            کشف محتوا بر اساس موضوع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`px-3 py-1 text-sm rounded-full border hover:bg-muted transition-colors ${
                !currentTag ? 'bg-muted' : ''
              }`}
              dir="rtl"
            >
              همه برچسب‌ها
            </Link>

            {tags.slice(0, 15).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={`px-3 py-1 text-sm rounded-full border hover:bg-muted transition-colors ${
                  currentTag === tag.slug ? 'bg-muted' : ''
                }`}
                dir="rtl"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {tags.length > 15 && (
            <div className="mt-4 text-center">
              <Link href="/blog/tags" className="text-sm text-primary hover:underline" dir="rtl">
                مشاهده همه برچسب‌ها ←
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Clock className="h-5 w-5" />
            آخرین پست‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => {
              const daysAgo = Math.floor(
                (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
              )
              
              return (
                <div key={post.id} className="space-y-2">
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 text-right">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground text-right">
                      {daysAgo === 0 ? 'امروز' : `${daysAgo} روز پیش`}
                    </p>
                  </Link>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <User className="h-5 w-5" />
            در جریان بمانید
          </CardTitle>
          <CardDescription className="text-right">
            آخرین پست‌ها را در صندوق ورودی خود دریافت کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            <Input placeholder="آدرس ایمیل شما" type="email" className="text-right" />
            <Button className="w-full">
              عضویت
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              هرزنامه ارسال نمی‌کنیم، در هر زمان می‌توانید لغو عضویت کنید.
            </p>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}

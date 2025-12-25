'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  Calendar,
  User,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface Post {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED' | 'TRASH'
  author: {
    id: string
    name: string
    email: string
  }
  publishedAt?: string
  scheduledAt?: string
  viewCount: number
  isFeatured: boolean
  categories: Array<{
    category: {
      id: string
      name: string
      slug: string
    }
  }>
  tags: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
  createdAt: string
  updatedAt: string
}

interface PostsTableProps {
  page: number
  search: string
  status: string
  category: string
  author: string
}

// Action Modal Component
function ActionModal({ post, isOpen, onClose, onEdit, onPreview, onDelete }: {
  post: Post
  isOpen: boolean
  onClose: () => void
  onEdit: (post: Post) => void
  onPreview: (post: Post) => void
  onDelete: (post: Post) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>عملیات پست</DialogTitle>
          <DialogDescription>
            عملیات مورد نظر را برای پست "{post.title}" انتخاب کنید
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              onEdit(post)
              onClose()
            }}
          >
            <Edit className="h-4 w-4" />
            ویرایش پست
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              onPreview(post)
              onClose()
            }}
          >
            <Eye className="h-4 w-4" />
            پیش‌نمایش پست
          </Button>
          
          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={() => {
              onDelete(post)
              onClose()
            }}
          >
            <Trash2 className="h-4 w-4" />
            حذف پست
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PostsTable({ page, search, status, category, author }: PostsTableProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(search && { search }),
          ...(status !== 'all' && { status }),
          ...(category !== 'all' && { category }),
          ...(author !== 'all' && { author })
        })

        const response = await fetch(`/api/cms/posts?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        toast({
          title: 'خطا',
          description: 'خطا در بارگذاری پست‌ها',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, search, status, category, author])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id))
    } else {
      setSelectedPosts([])
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId])
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId))
    }
  }

  const getStatusBadge = (status: Post['status']) => {
    const variants = {
      DRAFT: 'secondary',
      PUBLISHED: 'default',
      SCHEDULED: 'outline',
      ARCHIVED: 'destructive',
      TRASH: 'destructive'
    } as const

    const labels = {
      DRAFT: 'پیش‌نویس',
      PUBLISHED: 'منتشر شده',
      SCHEDULED: 'زمان‌بندی شده',
      ARCHIVED: 'بایگانی شده',
      TRASH: 'حذف شده'
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) return

    try {
      const promises = selectedPosts.map(postId => {
        const url = `/api/cms/posts/${postId}`
        const method = action === 'delete' ? 'DELETE' : 'PUT'
        const body = action === 'delete' ? undefined : JSON.stringify({ status: action.toUpperCase() })
        
        return fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          ...(body && { body })
        })
      })

      await Promise.all(promises)
      
      toast({
        title: 'موفق',
        description: `عملیات ${action} با موفقیت انجام شد`,
      })
      
      // Refresh the posts list
      window.location.reload()
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در انجام عملیات',
        variant: 'destructive'
      })
    }
  }

  const handleOpenModal = (post: Post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const handleEdit = (post: Post) => {
    router.push(`/cms/posts/${post.id}`)
  }

  const handlePreview = (post: Post) => {
    router.push(`/blog/${post.slug}`)
  }

  const handleDelete = async (post: Post) => {
    if (confirm(`آیا مطمئن هستید که می‌خواهید پست "${post.title}" را حذف کنید؟`)) {
      try {
        const response = await fetch(`/api/cms/posts/${post.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('خطا در حذف پست')
        }

        toast({
          title: 'موفق',
          description: 'پست با موفقیت حذف شد',
        })

        // Refresh the posts list
        window.location.reload()
      } catch (error) {
        toast({
          title: 'خطا',
          description: 'خطا در حذف پست',
          variant: 'destructive'
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">در حال بارگذاری...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">خطا در بارگذاری پست‌ها: {error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          تلاش مجدد
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedPosts.length} پست انتخاب شده
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('publish')}
            >
              انتشار
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('archive')}
            >
              بایگانی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
            >
              حذف
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12 sticky right-0 bg-gray-50 z-10">
                <Checkbox
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold min-w-[200px]">عنوان</TableHead>
              <TableHead className="font-semibold w-24">وضعیت</TableHead>
              <TableHead className="font-semibold w-32">نویسنده</TableHead>
              <TableHead className="font-semibold w-32">دسته‌بندی‌ها</TableHead>
              <TableHead className="font-semibold w-20">بازدید</TableHead>
              <TableHead className="font-semibold w-32">آخرین ویرایش</TableHead>
              <TableHead className="w-12 sticky left-0 bg-gray-50 z-10">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-gray-400 text-4xl">📝</div>
                    <p className="text-gray-500 text-lg">هیچ پستی یافت نشد</p>
                    <p className="text-gray-400 text-sm">برای شروع، پست جدیدی ایجاد کنید</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="sticky right-0 bg-white z-10">
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => handleSelectPost(post.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 truncate">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {post.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-24">
                    {getStatusBadge(post.status)}
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{post.author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="flex gap-1 flex-wrap">
                      {post.categories.slice(0, 2).map((cat) => (
                        <Badge key={cat.category.id} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {cat.category.name}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-20 text-sm text-gray-600">
                    {post.viewCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="w-32 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="w-12 sticky left-0 bg-white z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal(post)
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            نمایش {((pagination.page - 1) * pagination.limit) + 1} تا {Math.min(pagination.page * pagination.limit, pagination.total)} از {pagination.total} پست
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                params.set('page', (pagination.page - 1).toString())
                router.push(`?${params.toString()}`)
              }}
              className="gap-2"
            >
              ← قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => {
                const params = new URLSearchParams(window.location.search)
                params.set('page', (pagination.page + 1).toString())
                router.push(`?${params.toString()}`)
              }}
              className="gap-2"
            >
              بعدی →
            </Button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {selectedPost && (
        <ActionModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

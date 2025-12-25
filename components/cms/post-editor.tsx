'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RichTextEditor } from '@/components/cms/rich-text-editor'
import { toast } from '@/hooks/use-toast'
import { Save, Eye, Send, Calendar, MessageSquare } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  featuredImage?: string | null
  status: string
  publishedAt?: Date | null
  scheduledAt?: Date | null
  isFeatured: boolean
  allowComments: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: string | null
  canonicalUrl?: string | null
  authorId: string
  categories: Array<{ category: Category }>
  tags: Array<{ tag: Tag }>
}

interface PostEditorProps {
  isNew: boolean
  post?: Post
}

export function PostEditor({ isNew, post }: PostEditorProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featuredImage: post?.featuredImage || '',
    status: post?.status || 'DRAFT',
    publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
    scheduledAt: post?.scheduledAt || '',
    isFeatured: post?.isFeatured || false,
    allowComments: post?.allowComments || true,
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || '',
    seoKeywords: post?.seoKeywords || '',
    ogTitle: post?.ogTitle || '',
    ogDescription: post?.ogDescription || '',
    ogImage: post?.ogImage || '',
    twitterTitle: post?.twitterTitle || '',
    twitterDescription: post?.twitterDescription || '',
    twitterImage: post?.twitterImage || '',
    canonicalUrl: post?.canonicalUrl || '',
    categoryIds: post?.categories?.map(c => c.category.id) || [],
    tagIds: post?.tags?.map(t => t.tag.id) || [],
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطا',
        description: 'لطفاً فقط فایل‌های تصویری آپلود کنید',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'خطا',
        description: 'حجم فایل نباید بیشتر از 5 مگابایت باشد',
        variant: 'destructive'
      })
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'blog-featured-images')

      const response = await fetch('/api/cms/media/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('خطا در آپلود تصویر')
      }

      const result = await response.json()
      
      updateField('featuredImage', result.url)
      
      toast({
        title: 'موفق',
        description: 'تصویر با موفقیت آپلود شد',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'خطا',
        description: 'خطا در آپلود تصویر',
        variant: 'destructive'
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (status: string) => {
    if (!formData.title.trim()) {
      toast({
        title: 'خطا',
        description: 'لطفاً عنوان پست را وارد کنید',
        variant: 'destructive'
      })
      return
    }

    if (!formData.content.trim()) {
      toast({
        title: 'خطا',
        description: 'لطفاً محتوای پست را وارد کنید',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    
    try {
      const url = isNew ? '/api/cms/posts' : `/api/cms/posts/${post?.id}`
      const method = isNew ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در ذخیره پست')
      }

      const savedPost = await response.json()
      
      toast({
        title: 'موفق',
        description: `${isNew ? 'پست جدید' : 'پست'} با موفقیت ذخیره شد`,
      })

      router.push(`/cms/posts/${savedPost.id}`)
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در ذخیره پست',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title Input */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان پست</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="عنوان پست خود را وارد کنید..."
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>محتوای پست</CardTitle>
            <CardDescription>
              از ویرایشگر متن غنی برای ایجاد محتوای جذاب استفاده کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => updateField('content', content)}
              placeholder="محتوای پست را بنویسید..."
              height={400}
            />
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card>
          <CardHeader>
            <CardTitle>چکیده</CardTitle>
            <CardDescription>
              خلاصه کوتاهی از محتوای پست (اختیاری)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              placeholder="خلاصه کوتاه پست..."
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>عملیات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleSave('DRAFT')} 
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {isNew ? 'ایجاد پیش‌نویس' : 'ذخیره به عنوان پیش‌نویس'}
            </Button>
            
            <Button 
              onClick={() => handleSave('PUBLISHED')} 
              className="w-full justify-start gap-2"
              disabled={saving}
            >
              <Send className="h-4 w-4" />
              {isNew ? 'انتشار' : 'ذخیره و انتشار'}
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => updateField('isFeatured', checked)}
              />
              <Label htmlFor="isFeatured">پست ویژه</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowComments"
                checked={formData.allowComments}
                onCheckedChange={(checked) => updateField('allowComments', checked)}
              />
              <Label htmlFor="allowComments">اجازه نظرات</Label>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">عنوان SEO</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => updateField('seoTitle', e.target.value)}
                placeholder="عنوان برای موتورهای جستجو..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">توضیحات SEO</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => updateField('seoDescription', e.target.value)}
                placeholder="توضیحات برای موتورهای جستجو..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords">کلمات کلیدی</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => updateField('seoKeywords', e.target.value)}
                placeholder="کلمات کلیدی را با کاما جدا کنید..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>تصویر شاخص</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="imageUpload">آپلود تصویر</Label>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="cursor-pointer"
                />
                {uploadingImage && (
                  <p className="text-sm text-gray-500">در حال آپلود...</p>
                )}
              </div>

              {/* Current Image Preview */}
              {formData.featuredImage && (
                <div className="space-y-2">
                  <Label>تصویر فعلی</Label>
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Manual URL Input */}
              <div className="space-y-2">
                <Label htmlFor="featuredImage">آدرس تصویر (دستی)</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => updateField('featuredImage', e.target.value)}
                  placeholder="آدرس تصویر شاخص..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

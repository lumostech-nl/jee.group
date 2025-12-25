'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  color?: string
  icon?: string
  isActive: boolean
  sortOrder: number
  parent?: Category
  children?: Category[]
  _count?: {
    posts: number
  }
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: 'none',
    color: '',
    icon: '',
    isActive: true,
    sortOrder: 0
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/cms/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: 'خطا',
        description: 'خطا در بارگذاری دسته‌بندی‌ها',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setSaving(true)
    try {
      const url = editingCategory 
        ? `/api/cms/categories/${editingCategory.id}`
        : '/api/cms/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId === 'none' ? null : formData.parentId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save category')
      }

      toast({
        title: 'موفق',
        description: `دسته‌بندی ${editingCategory ? 'ویرایش' : 'ایجاد'} شد`,
      })

      fetchCategories()
      resetForm()
    } catch (error) {
      console.error('Error saving category:', error)
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در ذخیره دسته‌بندی',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || 'none',
      color: category.color || '',
      icon: category.icon || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`آیا مایل به حذف دسته‌بندی "${category.name}" هستید؟`)) return

    try {
      const response = await fetch(`/api/cms/categories/${category.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      toast({
        title: 'موفق',
        description: 'دسته‌بندی حذف شد',
      })

      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در حذف دسته‌بندی',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: 'none',
      color: '',
      icon: '',
      isActive: true,
      sortOrder: 0
    })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const parentCategories = categories.filter(cat => !cat.parentId || cat.id !== formData.parentId)

  if (loading) {
    return <div className="text-center py-8">درحال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">فهرست دسته‌بندی‌ها</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              دسته‌بندی جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات دسته‌بندی را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام دسته‌بندی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="نام دسته‌بندی..."
                  required
                />
              </div>

              {parentCategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="parentId">زیردسته‌بندی</Label>
                  <Select 
                    value={formData.parentId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته‌بندی والد (اختیاری)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون دسته‌بندی والد</SelectItem>
                      {parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="توضیحات دسته‌بندی..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  لغو
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'درحال ذخیره...' : editingCategory ? 'ویرایش' : 'ایجاد'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">هیچ دسته‌بندی ایجاد نشده است</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.isActive ? (
                        <Badge variant="default">فعال</Badge>
                      ) : (
                        <Badge variant="secondary">غیرفعال</Badge>
                      )}
                      {category.parent && (
                        <Badge variant="outline">
                          زیرمجموعه: {category.parent.name}
                        </Badge>
                      )}
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {category._count?.posts || 0} پست
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

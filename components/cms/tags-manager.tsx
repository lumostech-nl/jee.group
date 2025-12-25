'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Tags } from 'lucide-react'

interface Tag {
  id: string
  name: string
  slug: string
  color?: string
  isActive: boolean
  _count?: {
    posts: number
  }
}

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    isActive: true
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/cms/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast({
        title: 'خطا',
        description: 'خطا در بارگذاری برچسب‌ها',
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
      const url = editingTag 
        ? `/api/cms/tags/${editingTag.id}`
        : '/api/cms/tags'
      const method = editingTag ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save tag')
      }

      toast({
        title: 'موفق',
        description: `برچسب ${editingTag ? 'ویرایش' : 'ایجاد'} شد`,
      })

      fetchTags()
      resetForm()
    } catch (error) {
      console.error('Error saving tag:', error)
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در ذخیره برچسب',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color || '',
      isActive: tag.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`آیا مایل به حذف برچسب "${tag.name}" هستید؟`)) return

    try {
      const response = await fetch(`/api/cms/tags/${tag.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }

      toast({
        title: 'موفق',
        description: 'برچسب حذف شد',
      })

      fetchTags()
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast({
        title: 'خطا',
        description: error instanceof Error ? error.message : 'خطا در حذف برچسب',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      color: '',
      isActive: true
    })
    setEditingTag(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return <div className="text-center py-8">درحال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">فهرست برچسب‌ها</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              برچسب جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'ویرایش برچسب' : 'ایجاد برچسب جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات برچسب را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام برچسب</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="نام برچسب..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">رنگ (اختیاری)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#000000 یا نام رنگ"
                    className="flex-1"
                  />
                  {formData.color && (
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: formData.color }}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">فعال</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  لغو
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'درحال ذخیره...' : editingTag ? 'ویرایش' : 'ایجاد'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ برچسب ایجاد نشده است</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={tag.isActive ? "default" : "secondary"}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      {tag._count?.posts || 0} پست
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tag)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

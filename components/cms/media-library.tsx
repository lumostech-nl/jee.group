'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Image as ImageIcon,
  Video,
  File,
  Calendar
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  altText?: string
  caption?: string
  width?: number
  height?: number
  createdAt: string
  postId?: string
}

interface MediaLibraryProps {
  type: 'all' | 'images' | 'videos' | 'documents'
}

export function MediaLibrary({ type }: MediaLibraryProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  // Mock data for now
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      filename: 'hero-image.jpg',
      originalName: 'hero-image.jpg',
      mimeType: 'image/jpeg',
      size: 2048576,
      url: '/placeholder.jpg',
      thumbnailUrl: '/placeholder.jpg',
      altText: 'Hero section image',
      width: 1920,
      height: 1080,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      filename: 'product-demo.mp4',
      originalName: 'product-demo.mp4',
      mimeType: 'video/mp4',
      size: 52428800,
      url: '/placeholder.jpg',
      createdAt: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      filename: 'whitepaper.pdf',
      originalName: 'Complete Guide to React.pdf',
      mimeType: 'application/pdf',
      size: 3145728,
      url: '/placeholder.jpg',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ]

  const filteredFiles = mockFiles.filter(file => {
    if (type === 'all') return true
    if (type === 'images') return file.mimeType.startsWith('image/')
    if (type === 'videos') return file.mimeType.startsWith('video/')
    if (type === 'documents') return !file.mimeType.startsWith('image/') && !file.mimeType.startsWith('video/')
    return false
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map(file => file.id))
    } else {
      setSelectedFiles([])
    }
  }

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId])
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId))
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image'
    if (mimeType.startsWith('video/')) return 'Video'
    return 'Document'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for files:`, selectedFiles)
    // Implement bulk actions
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedFiles.length === filteredFiles.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedFiles.length > 0 ? `${selectedFiles.length} selected` : 'Select all'}
            </span>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('download')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {file.mimeType.startsWith('image/') && file.thumbnailUrl ? (
                  <Image
                    src={file.thumbnailUrl}
                    alt={file.altText || file.originalName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {getFileIcon(file.mimeType)}
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{file.originalName}</DialogTitle>
                        <DialogDescription>
                          {getFileType(file.mimeType)} • {formatFileSize(file.size)}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center">
                        {file.mimeType.startsWith('image/') && file.thumbnailUrl ? (
                          <Image
                            src={file.thumbnailUrl}
                            alt={file.altText || file.originalName}
                            width={600}
                            height={400}
                            className="max-w-full max-h-96 object-contain"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <div className="text-6xl mb-4">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <p className="text-muted-foreground">
                              Preview not available for this file type
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Checkbox
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
                className="absolute top-2 left-2"
              />

              <div className="mt-2">
                <p className="text-sm font-medium truncate">{file.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)} • {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Checkbox
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={(checked) => handleSelectFile(file.id, !!checked)}
              />

              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  {getFileIcon(file.mimeType)}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="font-medium">{file.originalName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{getFileType(file.mimeType)}</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

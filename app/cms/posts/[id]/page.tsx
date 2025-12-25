import { redirect, notFound } from 'next/navigation'
import { requireAuth, canEditPost } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { PostEditor } from '@/components/cms/post-editor'
import { prisma } from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await requireAuth()

  // Fetch the post first
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { id: true, name: true }
      },
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!post) {
    notFound()
  }

  // Check if user can edit this post
  if (!canEditPost(user.role, post.authorId, user.id)) {
    redirect('/cms/posts')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/cms/posts">
              <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                ویرایش پست: {post.title}
              </h1>
              <p className="text-gray-600 mt-2">
                آخرین ویرایش: {new Date(post.updatedAt).toLocaleDateString('fa-IR')}
              </p>
            </div>
          </div>
        </div>

        {/* Post Editor */}
        <PostEditor 
          isNew={false} 
          post={post}
        />
      </div>
    </AdminLayout>
  )
}

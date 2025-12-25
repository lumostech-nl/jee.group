import { redirect } from "next/navigation";
import { requireAuth, canEditPost } from "@/lib/auth";
import { AdminLayout } from "@/components/AdminLayout";
import { PostEditor } from "@/components/cms/post-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewPostPage() {
  const user = await requireAuth();

  if (!canEditPost(user.role)) {
    redirect("/cms");
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
                ایجاد پست جدید
              </h1>
              <p className="text-gray-600 mt-2">
                پست جدید وبلاگ ایجاد کنید و آن را منتشر کنید
              </p>
            </div>
          </div>
        </div>

        {/* Post Editor */}
        <PostEditor isNew={true} />
      </div>
    </AdminLayout>
  );
}

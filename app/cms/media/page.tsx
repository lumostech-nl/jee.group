import { requireAuth } from '@/lib/auth'
import { AdminLayout } from '@/components/AdminLayout'
import { MediaLibrary } from '@/components/cms/media-library'
import { UploadButton } from '@/components/cms/upload-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Image, Video, File, HardDrive } from 'lucide-react'

export default async function MediaPage() {
  const user = await requireAuth()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">کتابخانه رسانه</h1>
            <p className="text-muted-foreground">
              تصاویر، ویدیوها، اسناد و سایر فایل‌های رسانه خود را مدیریت کنید.
            </p>
          </div>
          <UploadButton />
        </div>

        {/* Storage Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مجموع فایل‌ها</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۱,۲۴۷</div>
              <p className="text-xs text-muted-foreground">
                +۱۲% از ماه گذشته
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تصاویر</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۸۹۲</div>
              <p className="text-xs text-muted-foreground">
                مجموع ۲.۴ گیگابایت
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ویدیوها</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۲۳</div>
              <p className="text-xs text-muted-foreground">
                مجموع ۱۵۶ مگابایت
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">اسناد</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">۳۳۲</div>
              <p className="text-xs text-muted-foreground">
                مجموع ۴۵ مگابایت
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Media Library Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">همه رسانه‌ها</TabsTrigger>
            <TabsTrigger value="images">تصاویر</TabsTrigger>
            <TabsTrigger value="videos">ویدیوها</TabsTrigger>
            <TabsTrigger value="documents">اسناد</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <MediaLibrary type="all" />
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <MediaLibrary type="images" />
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <MediaLibrary type="videos" />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <MediaLibrary type="documents" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

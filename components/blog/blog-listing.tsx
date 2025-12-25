import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { faIR } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  author: {
    name: string | null;
    image?: string | null;
  };
  publishedAt?: Date | null;
  readingTime?: number | null;
  isFeatured: boolean;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface BlogListingProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export function BlogListing({
  posts,
  currentPage,
  totalPages,
  totalPosts,
}: BlogListingProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12" dir="rtl">
        <h3 className="text-lg font-semibold mb-2">هیچ پستی یافت نشد</h3>
        <p className="text-muted-foreground">
          لطفاً معیارهای جستجو یا فیلتر خود را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0 py-0 px-0 m-0"
          >
            {post.featuredImage && (
              <div className="relative aspect-video w-full -mx-0">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {post.isFeatured && (
                  <Badge className="absolute top-4 text-right right-4">
                    ویژه
                  </Badge>
                )}
              </div>
            )}

            <CardHeader className="px-6 py-6 !px-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {post.publishedAt
                    ? format(new Date(post.publishedAt), "yyyy/MM/dd", {
                        locale: faIR,
                      })
                    : "پیش‌نویس"}
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} دقیقه خوانده شده
                  </div>
                )}
              </div>

              <CardTitle className="text-lg text-right line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>

              <CardDescription className="text-right line-clamp-3">
                {post.excerpt || "توضیح مختصری در دسترس نیست."}
              </CardDescription>

              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2">
                {post.categories.map((pc) => (
                  <Badge
                    key={pc.category.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    <Link href={`/blog/category/${pc.category.slug}`}>
                      {pc.category.name}
                    </Link>
                  </Badge>
                ))}
                {post.tags.slice(0, 2).map((pt) => (
                  <Badge key={pt.tag.id} variant="outline" className="text-xs">
                    <Link href={`/blog/tag/${pt.tag.slug}`}>{pt.tag.name}</Link>
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 !px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={post.author.image || undefined}
                      alt={post.author.name || "Author"}
                    />
                    <AvatarFallback>
                      {(post.author.name || "A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.publishedAt!), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    خواندن ادامه
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2" dir="rtl">
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`?page=${currentPage + 1}`}>
                قبلی
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              const isActive = pageNumber === currentPage;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`?page=${pageNumber}`}>{pageNumber}</Link>
                </Button>
              );
            })}
          </div>

          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`?page=${currentPage - 1}`}>
                بعدی
                <ChevronLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground" dir="rtl">
        نمایش {posts.length} از {totalPosts} پست
        {currentPage > 1 && ` (صفحه ${currentPage} از ${totalPages})`}
      </div>
    </div>
  );
}

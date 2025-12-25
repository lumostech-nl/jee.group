import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, TrendingUp, ArrowRight } from "lucide-react";

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
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface BlogPostSidebarProps {
  post: Post;
  relatedPosts: Post[];
}

export function BlogPostSidebar({ post, relatedPosts }: BlogPostSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Related Posts
            </CardTitle>
            <CardDescription>
              More articles you might find interesting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="flex gap-3">
                  {relatedPost.featuredImage && (
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-sm line-clamp-2">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {relatedPost.publishedAt
                        ? new Date(relatedPost.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </div>
                    <div className="flex gap-1">
                      {relatedPost.categories.slice(0, 2).map((pc) => (
                        <Badge
                          key={pc.category.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {pc.category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle>دریافت به‌روزرسانی‌ها</CardTitle>
          <CardDescription>
            برای دریافت آخرین مقالات و بینش‌ها در خبرنامه ما عضو شوید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="آدرس ایمیل شما"
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            />
            <Button className="w-full">عضویت</Button>
            <p className="text-xs text-muted-foreground text-center">
              به بیش از 1000 عضو بپیوندید. هر زمان می‌توانید لغو عضویت کنید.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Author Info */}
      <Card>
        <CardHeader>
          <CardTitle>درباره نویسنده</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
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
              <h3 className="font-semibold">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground">نویسنده</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            علاقه‌مند به فناوری و نوآوری، به اشتراک‌گذاری بینش‌ها و تجربیات برای
            کمک به رشد دیگران در مسیر حرفه‌ای‌شان.
          </p>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>ما را دنبال کنید</CardTitle>
          <CardDescription>
            در شبکه‌های اجتماعی با ما در ارتباط باشید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="w-full min-w-0">
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="w-full min-w-0">
              LinkedIn
            </Button>
            <Button variant="outline" size="sm" className="w-full min-w-0">
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

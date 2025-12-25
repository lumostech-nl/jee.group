"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { faIR } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  author: {
    name: string | null;
    image?: string | null;
    bio?: string | null;
  };
  publishedAt?: Date | null;
  readingTime?: number | null;
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
  allowComments: boolean;
}

interface BlogPostContentProps {
  post: Post;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.id}`;

  const handleShare = async (platform: string) => {
    const text = `Check out this article: ${post.title}`;
    const url = encodeURIComponent(postUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <article className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/blog">
          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          بازگشت به وبلاگ
        </Link>
      </Button>

      {/* Hero Section */}
      <header className="space-y-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {post.categories.map((pc) => (
            <Badge key={pc.category.id} variant="secondary">
              <Link href={`/blog/category/${pc.category.slug}`}>
                {pc.category.name}
              </Link>
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-snug">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
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
            <span className="font-medium">{post.author.name}</span>
          </div>

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

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <span className="text-sm font-medium">اشتراک گذاری:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      {post.content ? (
        <div
          className="prose max-w-[70ch] md:max-w-[72ch] lg:max-w-[75ch] prose-headings:scroll-mt-20 blog-content"
          style={{
            direction: "rtl",
            textAlign: "right",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <div className="text-gray-500 italic">محتوای پست در دسترس نیست.</div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">برچسب‌ها</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((pt) => (
              <Badge key={pt.tag.id} variant="outline">
                <Link href={`/blog/tag/${pt.tag.slug}`}>{pt.tag.name}</Link>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {post.author.bio && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={post.author.image || undefined}
                  alt={post.author.name || "Author"}
                />
                <AvatarFallback className="text-lg">
                  {(post.author.name || "A")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  درباره {post.author.name}
                </h3>
                <p className="text-muted-foreground">{post.author.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </article>
  );
}

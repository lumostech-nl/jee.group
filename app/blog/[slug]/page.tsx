import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  generateMetadata as generateSEOMetadata,
  generateArticleStructuredData,
} from "@/lib/seo";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogPostSidebar } from "@/components/blog/blog-post-sidebar";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  if (!post) {
    return {
      title: "Post Not Found - Jee Group",
    };
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

  return generateSEOMetadata({
    title: post.seoTitle || post.title,
    description:
      post.seoDescription || post.excerpt || post.content.substring(0, 160),
    keywords: post.seoKeywords || undefined,
    image: post.featuredImage || post.ogImage || undefined,
    url,
    type: "article",
    author: post.author.name || undefined,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    tags: [], // You could add category/tag names here
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: {
        select: { name: true, image: true, bio: true },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const structuredData = generateArticleStructuredData({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 300),
    image: post.featuredImage || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    publishedTime: post.publishedAt!.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || "Unknown",
    tags: [
      ...post.categories.map((pc) => pc.category.name),
      ...post.tags.map((pt) => pt.tag.name),
    ],
  });

  // Get related posts (same categories or tags)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: post.id },
      OR: [
        {
          categories: {
            some: {
              categoryId: {
                in: post.categories.map((pc) => pc.categoryId),
              },
            },
          },
        },
        {
          tags: {
            some: {
              tagId: {
                in: post.tags.map((pt) => pt.tagId),
              },
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: { name: true },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PersianHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogPostContent post={post} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 lg:mt-35 xl:mt-74">
            <BlogPostSidebar post={post} relatedPosts={relatedPosts} />
          </div>
        </div>
      </div>
      <PersianFooter />
    </>
  );
}

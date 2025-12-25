import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { generateMetadata, generateWebsiteStructuredData } from "@/lib/seo";
import { BlogListing } from "@/components/blog/blog-listing";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";

export const metadata: Metadata = generateMetadata({
  title: "وبلاگ - گروه آتی ارتباطات ژی",
  description:
    "اطلاعات حرفه‌ای در زمینه توسعه نرم‌افزار، فناوری و راهکارهای کسب‌وکار از گروه شرکت آتی ارتباطات ژی.",
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  type: "website",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt((searchParams.page as string) || "1");
  const category = searchParams.category as string;
  const tag = searchParams.tag as string;
  const search = searchParams.search as string;

  const postsPerPage = 10;
  const skip = (page - 1) * postsPerPage;

  // Build where clause
  const where: any = {
    status: "PUBLISHED",
  };

  if (category) {
    where.categories = {
      some: {
        category: {
          slug: category,
        },
      },
    };
  }

  if (tag) {
    where.tags = {
      some: {
        tag: {
          slug: tag,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch posts
  const [posts, totalPosts, categories, tags, recentPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { name: true, image: true },
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
      orderBy: { publishedAt: "desc" },
      skip,
      take: postsPerPage,
    }),
    prisma.blogPost.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            posts: {
              where: { post: { status: "PUBLISHED" } },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            posts: {
              where: { post: { status: "PUBLISHED" } },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const structuredData = generateWebsiteStructuredData();

  return (
    <>
      <PersianHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="pb-1 text-5xl font-bold pt-5 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              وبلاگ گروه ژی
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              مرجع تخصصی اطلاعات، آموزش‌ها و راهکارهای پیشرفته در حوزه فناوری،
              <br />
              توسعه نرم‌افزار و تحول دیجیتال
            </p>
          </div>

          <div className="w-full">
            <BlogListing
              posts={posts}
              currentPage={page}
              totalPages={totalPages}
              totalPosts={totalPosts}
            />
          </div>
        </div>
      </div>
      <PersianFooter />
    </>
  );
}

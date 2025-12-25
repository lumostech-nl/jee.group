import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, posts, categories, tags
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        page,
        totalPages: 0,
      });
    }

    const skip = (page - 1) * limit;
    const searchTerm = query.trim();

    const results: any[] = [];
    let total = 0;

    // Search posts
    if (type === "all" || type === "posts") {
      const postsWhere = {
        status: "PUBLISHED" as const,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" as const } },
          { content: { contains: searchTerm, mode: "insensitive" as const } },
          { excerpt: { contains: searchTerm, mode: "insensitive" as const } },
          {
            categories: {
              some: {
                category: {
                  name: { contains: searchTerm, mode: "insensitive" as const },
                },
              },
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: searchTerm, mode: "insensitive" as const },
                },
              },
            },
          },
        ],
      };

      const [posts, postsCount] = await Promise.all([
        prisma.blogPost.findMany({
          where: postsWhere,
          include: {
            author: {
              select: { name: true },
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
          orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
          skip: type === "posts" ? skip : 0,
          take: type === "posts" ? limit : 5,
        }),
        prisma.blogPost.count({ where: postsWhere }),
      ]);

      posts.forEach((post) => {
        results.push({
          id: post.id,
          type: "post",
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 200) + "...",
          slug: post.slug,
          url: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          author: post.author.name,
          categories: post.categories.map((pc) => pc.category.name),
          tags: post.tags.map((pt) => pt.tag.name),
        });
      });

      total += postsCount;
    }

    // Search categories
    if (type === "all" || type === "categories") {
      const categoriesWhere = {
        isActive: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" as const } },
          {
            description: { contains: searchTerm, mode: "insensitive" as const },
          },
        ],
      };

      const [categories, categoriesCount] = await Promise.all([
        prisma.category.findMany({
          where: categoriesWhere,
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
          skip: type === "categories" ? skip : 0,
          take: type === "categories" ? limit : 3,
        }),
        prisma.category.count({ where: categoriesWhere }),
      ]);

      categories.forEach((category) => {
        results.push({
          id: category.id,
          type: "category",
          title: category.name,
          excerpt:
            category.description ||
            `Category with ${category._count.posts} posts`,
          slug: category.slug,
          url: `/blog/category/${category.slug}`,
          postCount: category._count.posts,
        });
      });

      total += categoriesCount;
    }

    // Search tags
    if (type === "all" || type === "tags") {
      const tagsWhere = {
        isActive: true,
        OR: [{ name: { contains: searchTerm, mode: "insensitive" as const } }],
      };

      const [tags, tagsCount] = await Promise.all([
        prisma.tag.findMany({
          where: tagsWhere,
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
          skip: type === "tags" ? skip : 0,
          take: type === "tags" ? limit : 3,
        }),
        prisma.tag.count({ where: tagsWhere }),
      ]);

      tags.forEach((tag) => {
        results.push({
          id: tag.id,
          type: "tag",
          title: tag.name,
          excerpt: `Tag with ${tag._count.posts} posts`,
          slug: tag.slug,
          url: `/blog/tag/${tag.slug}`,
          postCount: tag._count.posts,
        });
      });

      total += tagsCount;
    }

    // Sort results by relevance (featured posts first, then by date)
    results.sort((a, b) => {
      // Prioritize featured posts (this would need to be added to the search results)
      if (a.type === "post" && b.type === "post") {
        if (a.publishedAt && b.publishedAt) {
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        }
      }
      return 0;
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      query: searchTerm,
      results: results.slice(0, limit),
      total,
      page,
      totalPages,
      type,
    });
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

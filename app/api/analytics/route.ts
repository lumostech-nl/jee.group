import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canManageUsers } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageUsers(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view analytics" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, 1y
    const metric = searchParams.get("metric") || "overview"; // overview, posts, views, engagement

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let analytics: any = {};

    if (metric === "overview" || metric === "posts") {
      // Posts analytics
      const [totalPosts, publishedPosts, draftPosts, postsThisPeriod] =
        await Promise.all([
          prisma.blogPost.count(),
          prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
          prisma.blogPost.count({ where: { status: "DRAFT" } }),
          prisma.blogPost.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
        ]);

      analytics.posts = {
        total: totalPosts,
        published: publishedPosts,
        drafts: draftPosts,
        thisPeriod: postsThisPeriod,
        trend: await calculateTrend("posts", startDate),
      };
    }

    if (metric === "overview" || metric === "views") {
      // Views analytics
      const [totalViews, viewsThisPeriod, topPosts] = await Promise.all([
        prisma.blogPost.aggregate({
          _sum: { viewCount: true },
        }),
        prisma.blogPost.aggregate({
          where: {
            publishedAt: { gte: startDate },
          },
          _sum: { viewCount: true },
        }),
        prisma.blogPost.findMany({
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            slug: true,
            viewCount: true,
            publishedAt: true,
          },
          orderBy: { viewCount: "desc" },
          take: 10,
        }),
      ]);

      analytics.views = {
        total: totalViews._sum.viewCount || 0,
        thisPeriod: viewsThisPeriod._sum.viewCount || 0,
        topPosts: topPosts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          views: post.viewCount,
          publishedAt: post.publishedAt,
        })),
        trend: await calculateTrend("views", startDate),
      };
    }

    if (metric === "overview" || metric === "engagement") {
      // Engagement analytics (categories, tags, authors)
      const [topCategories, topTags, topAuthors] = await Promise.all([
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
          orderBy: {
            posts: {
              _count: "desc",
            },
          },
          take: 10,
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
          orderBy: {
            posts: {
              _count: "desc",
            },
          },
          take: 10,
        }),
        prisma.user.findMany({
          where: {
            role: { in: ["AUTHOR", "EDITOR", "ADMIN"] },
            blogPosts: {
              some: {
                status: "PUBLISHED",
              },
            },
          },
          include: {
            _count: {
              select: {
                blogPosts: {
                  where: { status: "PUBLISHED" },
                },
              },
            },
            blogPosts: {
              where: { status: "PUBLISHED" },
              select: { viewCount: true },
            },
          },
          take: 10,
        }),
      ]);

      analytics.engagement = {
        topCategories: topCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          postCount: cat._count.posts,
        })),
        topTags: topTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          postCount: tag._count.posts,
        })),
        topAuthors: topAuthors.map((author) => ({
          id: author.id,
          name: author.name,
          email: author.email,
          postCount: author._count.blogPosts,
          totalViews: author.blogPosts.reduce(
            (sum, post) => sum + (post.viewCount || 0),
            0
          ),
        })),
      };
    }

    // Time series data for charts
    if (metric === "overview") {
      analytics.timeSeries = await getTimeSeriesData(startDate, period);
    }

    return NextResponse.json({
      period,
      metric,
      analytics,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

async function calculateTrend(type: "posts" | "views", startDate: Date) {
  const now = new Date();
  const midPoint = new Date(
    startDate.getTime() + (now.getTime() - startDate.getTime()) / 2
  );

  let firstHalfCount, secondHalfCount;

  if (type === "posts") {
    [firstHalfCount, secondHalfCount] = await Promise.all([
      prisma.blogPost.count({
        where: {
          createdAt: { gte: startDate, lt: midPoint },
        },
      }),
      prisma.blogPost.count({
        where: {
          createdAt: { gte: midPoint },
        },
      }),
    ]);
  } else {
    [firstHalfCount, secondHalfCount] = await Promise.all([
      prisma.blogPost.aggregate({
        where: {
          publishedAt: { gte: startDate, lt: midPoint },
        },
        _sum: { viewCount: true },
      }),
      prisma.blogPost.aggregate({
        where: {
          publishedAt: { gte: midPoint },
        },
        _sum: { viewCount: true },
      }),
    ]);
  }

  const firstHalf =
    type === "posts"
      ? firstHalfCount
      : (firstHalfCount as any)._sum?.viewCount || 0;
  const secondHalf =
    type === "posts"
      ? secondHalfCount
      : (secondHalfCount as any)._sum?.viewCount || 0;

  if (firstHalf === 0) {
    return secondHalf > 0 ? 100 : 0;
  }

  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
}

async function getTimeSeriesData(startDate: Date, period: string) {
  const now = new Date();
  const days =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const interval = Math.ceil(days / 20); // 20 data points max

  const postsData: Array<{ date: string; posts: number; views: number }> = [];
  const viewsData: Array<{ date: string; posts: number; views: number }> = [];

  for (let i = 0; i < days; i += interval) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const nextDate = new Date(
      currentDate.getTime() + interval * 24 * 60 * 60 * 1000
    );

    const [postsCount, viewsSum] = await Promise.all([
      prisma.blogPost.count({
        where: {
          createdAt: { gte: currentDate, lt: nextDate },
        },
      }),
      prisma.blogPost.aggregate({
        where: {
          publishedAt: { gte: currentDate, lt: nextDate },
        },
        _sum: { viewCount: true },
      }),
    ]);

    postsData.push({
      date: currentDate.toISOString().split("T")[0],
      posts: postsCount,
      views: viewsSum._sum.viewCount || 0,
    });
  }

  return {
    posts: postsData,
    views: viewsData,
  };
}

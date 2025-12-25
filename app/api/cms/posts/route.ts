import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canEditPost } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";
import readingTime from "reading-time";

export const dynamic = "force-dynamic";

// Validation schema for creating/updating posts
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED", "TRASH"])
    .default("DRAFT"),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  isFeatured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

// GET /api/cms/posts - List posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const author = searchParams.get("author") || "all";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add status filter
    if (status !== "all") {
      where.status = status;
    }

    // Add category filter
    if (category !== "all") {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Add author filter (only admins and editors can see all posts)
    if (author !== "all") {
      if (user.role === "AUTHOR") {
        // Authors can only see their own posts
        where.authorId = user.id;
      } else {
        // Admins and editors can filter by author
        where.authorId = author;
      }
    } else if (user.role === "AUTHOR") {
      // Authors can only see their own posts
      where.authorId = user.id;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true },
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
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.blogPost.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/cms/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = postSchema.parse(body);

    // Generate slug from title
    const slug = slugify(validatedData.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    // Calculate reading time
    const readTime = readingTime(validatedData.content);

    // Handle scheduled posts
    let publishedAt = null;
    if (validatedData.status === "PUBLISHED") {
      publishedAt = new Date();
    } else if (
      validatedData.status === "SCHEDULED" &&
      validatedData.scheduledAt
    ) {
      publishedAt = new Date(validatedData.scheduledAt);
    }

    const post = await prisma.blogPost.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        featuredImage: validatedData.featuredImage,
        authorId: user.id,
        status: validatedData.status,
        publishedAt,
        scheduledAt: validatedData.scheduledAt
          ? new Date(validatedData.scheduledAt)
          : null,
        readingTime: Math.ceil(readTime.minutes),
        isFeatured: validatedData.isFeatured,
        allowComments: validatedData.allowComments,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        seoKeywords: validatedData.seoKeywords,
        ogTitle: validatedData.ogTitle,
        ogDescription: validatedData.ogDescription,
        ogImage: validatedData.ogImage,
        twitterTitle: validatedData.twitterTitle,
        twitterDescription: validatedData.twitterDescription,
        twitterImage: validatedData.twitterImage,
        canonicalUrl: validatedData.canonicalUrl,
        categories: {
          create: validatedData.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
        tags: {
          create: validatedData.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canEditPost, canDeletePost } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";
import readingTime from "reading-time";

export const dynamic = "force-dynamic";

// Validation schema for updating posts
const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED", "TRASH"])
    .optional(),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  allowComments: z.boolean().optional(),
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
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

// GET /api/cms/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
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
        media: true,
        revisions: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user can view this post
    if (user.role === "AUTHOR" && post.authorId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own posts" },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/cms/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validatedData = updatePostSchema.parse(body);

    // Get the existing post to check permissions
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true, slug: true, publishedAt: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check permissions
    if (!canEditPost(user.role, existingPost.authorId, user.id)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit this post" },
        { status: 403 }
      );
    }

    // If title is being updated, check for slug conflicts
    let slug = existingPost.slug;
    if (validatedData.title) {
      const newSlug = slugify(validatedData.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Check if the new slug conflicts with another post
      if (newSlug !== existingPost.slug) {
        const conflictingPost = await prisma.blogPost.findUnique({
          where: { slug: newSlug },
        });

        if (conflictingPost && conflictingPost.id !== params.id) {
          return NextResponse.json(
            { error: "A post with this title already exists" },
            { status: 400 }
          );
        }

        slug = newSlug;
      }
    }

    // Calculate reading time if content is being updated
    let readingTimeMinutes = undefined;
    if (validatedData.content) {
      const readTime = readingTime(validatedData.content);
      readingTimeMinutes = Math.ceil(readTime.minutes);
    }

    // Handle scheduled posts
    let publishedAt = undefined;
    if (validatedData.status === "PUBLISHED" && !existingPost.publishedAt) {
      publishedAt = new Date();
    } else if (
      validatedData.status === "SCHEDULED" &&
      validatedData.scheduledAt
    ) {
      publishedAt = new Date(validatedData.scheduledAt);
    }

    // Start a transaction to update post and its relationships
    const result = await prisma.$transaction(async (tx) => {
      // Update the post
      const updatedPost = await tx.blogPost.update({
        where: { id: params.id },
        data: {
          ...(validatedData.title && { title: validatedData.title }),
          ...(slug !== existingPost.slug && { slug }),
          ...(validatedData.content && { content: validatedData.content }),
          ...(validatedData.excerpt !== undefined && {
            excerpt: validatedData.excerpt,
          }),
          ...(validatedData.featuredImage !== undefined && {
            featuredImage: validatedData.featuredImage,
          }),
          ...(validatedData.status && { status: validatedData.status }),
          ...(publishedAt !== undefined && { publishedAt }),
          ...(validatedData.scheduledAt !== undefined && {
            scheduledAt: validatedData.scheduledAt
              ? new Date(validatedData.scheduledAt)
              : null,
          }),
          ...(validatedData.isFeatured !== undefined && {
            isFeatured: validatedData.isFeatured,
          }),
          ...(validatedData.allowComments !== undefined && {
            allowComments: validatedData.allowComments,
          }),
          ...(validatedData.seoTitle !== undefined && {
            seoTitle: validatedData.seoTitle,
          }),
          ...(validatedData.seoDescription !== undefined && {
            seoDescription: validatedData.seoDescription,
          }),
          ...(validatedData.seoKeywords !== undefined && {
            seoKeywords: validatedData.seoKeywords,
          }),
          ...(validatedData.ogTitle !== undefined && {
            ogTitle: validatedData.ogTitle,
          }),
          ...(validatedData.ogDescription !== undefined && {
            ogDescription: validatedData.ogDescription,
          }),
          ...(validatedData.ogImage !== undefined && {
            ogImage: validatedData.ogImage,
          }),
          ...(validatedData.twitterTitle !== undefined && {
            twitterTitle: validatedData.twitterTitle,
          }),
          ...(validatedData.twitterDescription !== undefined && {
            twitterDescription: validatedData.twitterDescription,
          }),
          ...(validatedData.twitterImage !== undefined && {
            twitterImage: validatedData.twitterImage,
          }),
          ...(validatedData.canonicalUrl !== undefined && {
            canonicalUrl: validatedData.canonicalUrl,
          }),
          ...(readingTimeMinutes !== undefined && {
            readingTime: readingTimeMinutes,
          }),
        },
      });

      // Update categories if provided
      if (validatedData.categoryIds !== undefined) {
        await tx.postCategory.deleteMany({
          where: { postId: params.id },
        });

        if (validatedData.categoryIds.length > 0) {
          await tx.postCategory.createMany({
            data: validatedData.categoryIds.map((categoryId) => ({
              postId: params.id,
              categoryId,
            })),
          });
        }
      }

      // Update tags if provided
      if (validatedData.tagIds !== undefined) {
        await tx.postTag.deleteMany({
          where: { postId: params.id },
        });

        if (validatedData.tagIds.length > 0) {
          await tx.postTag.createMany({
            data: validatedData.tagIds.map((tagId) => ({
              postId: params.id,
              tagId,
            })),
          });
        }
      }

      return updatedPost;
    });

    // Fetch the updated post with all relations
    const updatedPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    // Get the existing post to check permissions
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true, status: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check permissions
    if (!canDeletePost(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete posts" },
        { status: 403 }
      );
    }

    // For soft delete, update status to TRASH
    const deletedPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: { status: "TRASH" },
    });

    return NextResponse.json({
      message: "Post moved to trash",
      post: deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

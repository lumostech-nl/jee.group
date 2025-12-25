import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canManageCategories } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";

export const dynamic = "force-dynamic";

// Validation schema for tags
const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  color: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET /api/cms/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage tags" },
        { status: 403 }
      );
    }

    const tags = await prisma.tag.findMany({
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
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/cms/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create tags" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = tagSchema.parse(body);

    // Generate slug from name
    const slug = slugify(validatedData.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug,
        color: validatedData.color,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

// PUT /api/cms/tags - Update a tag
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update tags" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    const validatedData = tagSchema.partial().parse(updateData);

    // If name is being updated, generate new slug
    if (validatedData.name) {
      const slug = slugify(validatedData.name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Check if new slug already exists for a different tag
      const existingTag = await prisma.tag.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingTag) {
        return NextResponse.json(
          { error: "A tag with this name already exists" },
          { status: 400 }
        );
      }

      (validatedData as any).slug = slug;
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/tags - Delete a tag
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete tags" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Check if tag is in use by any posts
    const postsCount = await prisma.postTag.count({
      where: { tagId: id },
    });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete tag that is assigned to posts. Please remove tag from all posts first.",
        },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

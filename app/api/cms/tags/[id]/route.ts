import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canManageCategories } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/cms/tags/[id] - Get a specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage tags" },
        { status: 403 }
      );
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}

// PUT /api/cms/tags/[id] - Update a specific tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update tags" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // If name is being updated, generate new slug
    let updateData = { ...body };
    if (body.name && body.name !== existingTag.name) {
      const slugify = (await import("slugify")).default;
      const slug = slugify(body.name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Check if new slug already exists for a different tag
      const slugExists = await prisma.tag.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A tag with this name already exists" },
          { status: 400 }
        );
      }

      updateData.slug = slug;
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: updateData,
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
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/tags/[id] - Delete a specific tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete tags" },
        { status: 403 }
      );
    }

    // Check if tag is in use by any posts
    const postsCount = await prisma.postTag.count({
      where: { tagId: params.id },
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

    const tag = await prisma.tag.delete({
      where: { id: params.id },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

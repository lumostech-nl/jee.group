import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canManageCategories } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/cms/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage categories" },
        { status: 403 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/cms/categories/[id] - Update a specific category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update categories" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Prevent circular parent reference
    if (body.parentId && body.parentId === params.id) {
      return NextResponse.json(
        { error: "Category cannot be its own parent" },
        { status: 400 }
      );
    }

    // Check for circular references through nested parents
    if (body.parentId) {
      let currentParentId = body.parentId;
      const visitedParents = new Set([params.id]);

      while (currentParentId) {
        if (visitedParents.has(currentParentId)) {
          return NextResponse.json(
            { error: "Circular parent reference detected" },
            { status: 400 }
          );
        }
        visitedParents.add(currentParentId);

        const parent = await prisma.category.findUnique({
          where: { id: currentParentId },
          select: { parentId: true },
        });

        currentParentId = parent?.parentId;
      }
    }

    // If name is being updated, generate new slug
    let updateData = { ...body };
    if (body.name && body.name !== existingCategory.name) {
      const slugify = (await import("slugify")).default;
      const slug = slugify(body.name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });

      // Check if new slug already exists for a different category
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 }
        );
      }

      updateData.slug = slug;
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/categories/[id] - Delete a specific category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete categories" },
        { status: 403 }
      );
    }

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: params.id },
    });

    if (childrenCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that has subcategories. Please move or delete subcategories first.",
        },
        { status: 400 }
      );
    }

    // Check if category is in use by any posts
    const postsCount = await prisma.postCategory.count({
      where: { categoryId: params.id },
    });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category that is assigned to posts. Please move posts to another category first.",
        },
        { status: 400 }
      );
    }

    const category = await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, canManageCategories } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";

export const dynamic = "force-dynamic";

// Validation schema for categories
const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

// GET /api/cms/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to manage categories" },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: {
          include: {
            parent: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/cms/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!canManageCategories(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create categories" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Generate slug from name
    const slug = slugify(validatedData.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Check for circular parent reference
    if (validatedData.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        parentId: validatedData.parentId,
        color: validatedData.color,
        icon: validatedData.icon,
        isActive: validatedData.isActive,
        sortOrder: validatedData.sortOrder,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

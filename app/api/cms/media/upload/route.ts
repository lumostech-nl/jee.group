import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  uploadBlogMediaToMinIO,
  deleteBlogMediaFromMinIO,
  initMinIO,
} from "@/lib/minio";

// Configure the API route to handle larger files
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log("Media upload endpoint called");
    const user = await requireAuth();
    console.log("User authenticated:", user.id, user.email);

    // Initialize blob storage (no-op for Vercel Blob, kept for compatibility)
    await initMinIO();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    console.log("Upload request received:", {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      folder,
    });

    if (!file) {
      console.error("Upload failed: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/webm",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error("Upload failed: Invalid file type:", file.type);
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error(
        "Upload failed: File too large:",
        file.size,
        "bytes (max:",
        maxSize,
        "bytes)"
      );
      return NextResponse.json(
        { error: `File ${file.name} exceeds maximum size of 10MB` },
        { status: 400 }
      );
    }

    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${originalName}.${extension}`;

      // Upload to Vercel Blob
      const url = await uploadBlogMediaToMinIO(
        buffer,
        filename,
        file.type,
        folder
      );

      // Save to database
      const mediaFile = await prisma.blogMedia.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url,
          uploadedById: user.id,
          isOptimized: file.type.startsWith("image/"),
        },
      });

      return NextResponse.json({
        message: "File uploaded successfully",
        url: mediaFile.url,
        filename: mediaFile.filename,
        id: mediaFile.id,
      });
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      return NextResponse.json(
        { error: `Failed to upload file ${file.name}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in media upload:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/media/upload - Delete uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    try {
      // First, find the media record to get the URL
      const mediaRecord = await prisma.blogMedia.findFirst({
        where: { filename },
      });

      if (!mediaRecord) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }

      // Delete from Vercel Blob using the stored URL
      await deleteBlogMediaFromMinIO(mediaRecord.url);

      // Delete from database
      await prisma.blogMedia.deleteMany({
        where: { filename },
      });

      return NextResponse.json({
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in media delete:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

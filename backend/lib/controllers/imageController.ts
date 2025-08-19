import { NextRequest, NextResponse } from "next/server";
import { cloudinaryService } from "@/backend/lib/services/cloudinaryService";

export class ImageController {
  async uploadImage(request: NextRequest) {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const folder = formData.get("folder") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Validar tipo de archivo
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed" },
          { status: 400 }
        );
      }

      // Validar tamaño (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File too large. Maximum size is 5MB" },
          { status: 400 }
        );
      }

      // Convertir File (Web API) → Buffer (Node)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imageUrl = await cloudinaryService.uploadImage({
        buffer,
        folder: folder || undefined,
        originalname: file.name,
      });

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
          filename: file.name,
          size: file.size,
          type: file.type,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }

  async uploadMultipleImages(request: NextRequest) {
    try {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const folder = formData.get("folder") as string | null;

      if (!files || files.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }

      if (files.length > 10) {
        return NextResponse.json({ error: "Maximum 10 files allowed" }, { status: 400 });
      }

      const uploadPromises = files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const imageUrl = await cloudinaryService.uploadImage({
            buffer,
            folder: folder || undefined,
            originalname: file.name,
          });

          return {
            success: true,
            filename: file.name,
            url: imageUrl,
            size: file.size,
            type: file.type,
          };
        } catch (error) {
          return {
            success: false,
            filename: file.name,
            error: "Failed to upload",
          };
        }
      });

      const results = await Promise.all(uploadPromises);

      return NextResponse.json({
        success: true,
        message: "Images upload completed",
        data: results,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
    }
  }

  async deleteImage(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const url = searchParams.get("url");

      if (!url) {
        return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
      }

      const publicId = cloudinaryService.extractPublicIdFromUrl(url);
      if (!publicId) {
        return NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 400 });
      }

      await cloudinaryService.deleteImage(publicId);

      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
  }
}

export const imageController = new ImageController();

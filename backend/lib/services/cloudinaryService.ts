// backend/lib/services/cloudinaryService.ts
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadImageParams {
  buffer: Buffer;
  folder?: string;
  originalname?: string;
}

export class CloudinaryService {
  // Subir imagen desde Buffer
  async uploadImage(params: UploadImageParams): Promise<string> {
    const { buffer, folder } = params;

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: folder || "uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }

  // Eliminar imagen usando public_id
  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== "ok") {
        throw new Error(`Delete failed: ${result.result}`);
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      throw new Error("Failed to delete image");
    }
  }

  // Generar public_id desde URL (opcional)
  extractPublicIdFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      const uploadIndex = pathname.indexOf("/upload/");
      if (uploadIndex === -1) return "";

      const uploadPath = pathname.substring(uploadIndex + 8); // saltar '/upload/'
      const versionMatch = uploadPath.match(/^v\d+\//);

      let publicIdPath = uploadPath;
      if (versionMatch) {
        publicIdPath = uploadPath.substring(versionMatch[0].length);
      }

      const dotIndex = publicIdPath.lastIndexOf(".");
      if (dotIndex !== -1) {
        publicIdPath = publicIdPath.substring(0, dotIndex);
      }

      return publicIdPath;
    } catch {
      return "";
    }
  }

  // Generar firma (si algún día necesitás signed upload)
  generateSignature(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    return crypto.createHash("sha1").update(sorted + process.env.CLOUDINARY_API_SECRET).digest("hex");
  }
}

export const cloudinaryService = new CloudinaryService();

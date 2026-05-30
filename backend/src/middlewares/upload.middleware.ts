import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError.js";

/**
 * Multer upload middleware.
 * Uses memory storage (for streaming to Cloudinary).
 * Accepts images only, max 5MB.
 */
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest("Only image files (jpeg, jpg, png, webp, avif) are allowed") as unknown as Error);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// config/multerConfig.ts
import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request } from "express";

/**
 * Fungsi untuk membuat konfigurasi penyimpanan dengan path dan filename dinamis.
 * @param destinationPath - Lokasi direktori untuk menyimpan file.
 * @param fileNamePrefix - Prefix untuk nama file, bisa menggunakan timestamp atau lainnya.
 * @returns Konfigurasi penyimpanan untuk multer.
 */
export function createStorage(
  destinationPath: string,
  fileNamePrefix = ""
): StorageEngine {
  return multer.diskStorage({
    destination: (req: Request, file, cb) => {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      cb(null, destinationPath);
    },
    filename: (req: Request, file, cb) => {
      const randomStr = crypto.randomBytes(3).toString("hex"); // 6 karakter hex
      const ext = path.extname(file.originalname);
      const fileName = `${fileNamePrefix}${Date.now()}-${randomStr}${ext}`;
      cb(null, fileName);
    },
  });
}

/**
 * Fungsi untuk membuat filter file berdasarkan mimetype yang diizinkan.
 * @param allowedMimes - Daftar mimetype yang diizinkan untuk upload.
 * @returns Fungsi filter untuk multer.
 */
export function createFileFilter(allowedMimes: string[]) {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File tidak diizinkan"));
    }
  };
}

/**
 * Fungsi utama untuk membuat konfigurasi multer upload.
 * @param destinationPath - Lokasi untuk menyimpan file.
 * @param allowedMimes - Mimetype file yang diizinkan.
 * @param fileNamePrefix - Prefix nama file (opsional).
 * @returns Instance multer dengan konfigurasi yang disesuaikan.
 */
export function createUpload(
  destinationPath: string,
  allowedMimes: string[],
  fileNamePrefix = ""
): multer.Multer {
  const storage = createStorage(destinationPath, fileNamePrefix);
  const fileFilter = createFileFilter(allowedMimes);

  return multer({ storage, fileFilter });
}

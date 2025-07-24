import { Request } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Menghasilkan full URL dari file upload berdasarkan request dan filename.
 * @param req - Request Express (harus mengandung req.file).
 * @param filename - Nama file yang diupload.
 * @returns Full URL file, contoh: http://localhost:3000/uploads/filename.jpg
 */
export function getFileUrl(req: Request, filename: string): string | null {
  if (!req || !filename) return null;

  const protocol = req.protocol;
  const host = req.get('host'); // Contoh: localhost:3000
  return `${protocol}://${host}/uploads/${filename}`;
}

/**
 * Menghapus file dari folder `uploads` berdasarkan filename
 * @param filename - Nama file relatif dari folder uploads (misal: `profil/avatar.jpg`)
 */
export function deleteUploadedFile(fileUrl: string): void {
  if (!fileUrl) return;

  // Cari posisi path `/uploads/` dalam URL
  const uploadsIndex = fileUrl.indexOf('/uploads/');
  if (uploadsIndex === -1) {
    console.warn("Path tidak valid, harus mengandung '/uploads/'");
    return;
  }

  // Ambil path relatif mulai dari setelah "/uploads/"
  const relativePath = fileUrl.slice(uploadsIndex + '/uploads/'.length); // contoh: "profil/avatar.jpg"

  // Gabungkan dengan direktori upload fisik
  const filePath = path.join(__dirname, '..', 'uploads', relativePath);

  console.log('Cek path file:', filePath);
  // Periksa dan hapus file
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Gagal menghapus file: ${filePath}`, unlinkErr);
        } else {
          console.log(`File dihapus: ${filePath}`);
        }
      });
    } else {
      console.warn(`File tidak ditemukan: ${filePath}`);
    }
  });
}

import { createUpload } from '@/configs/multer.config';
import path from 'path';

// Konfigurasi untuk upload gambar modul
const moduleUploadPath = path.resolve('src/uploads/modules');
const allowedModuleMimes = ['image/jpeg', 'image/png', 'image/gif'];

// Middleware untuk satu gambar 'imageUrl'
export const uploadModuleImage = createUpload(
  moduleUploadPath,
  allowedModuleMimes,
  'module-'
).single('imageUrl');

// Middleware untuk satu gambar 'contentImageUrl' (jika diperlukan terpisah)
export const uploadContentImage = createUpload(
  moduleUploadPath,
  allowedModuleMimes,
  'content-'
).single('contentImageUrl');

export const uploadMultipleContentImages = createUpload(
  moduleUploadPath,
  allowedModuleMimes
).array('contentImages', 10);

const quizUploadPath = path.resolve('src/uploads/quizzes');
const allowedQuizMimes = ['image/jpeg', 'image/png', 'image/gif'];

// Middleware untuk banyak file dengan field 'questionImages'
export const uploadQuestionImages = createUpload(
  quizUploadPath,
  allowedQuizMimes
).array('questionImages', 10);

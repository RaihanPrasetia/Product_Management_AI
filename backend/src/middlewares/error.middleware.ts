import { AppError } from '@/helpers/error.helper';
import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  error: Error, // Tipe diubah menjadi Error
  req: Request,
  res: Response,
  next: NextFunction // Meskipun tidak digunakan, ini wajib ada untuk format middleware error
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      success: false,
      message: error.message,
    });
    return;
  }

  // Untuk error yang tidak terduga
  console.error('UNHANDLED ERROR 💥:', error);

  res.status(500).json({
    status: 'error',
    success: false,
    message: 'Terjadi kesalahan pada server',
    // Tampilkan detail error hanya di mode development
    ...(process.env.NODE_ENV === 'development' && {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    }),
  });
};

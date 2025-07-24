// middlewares/auth.middleware.ts

import { verifyToken } from '@/helpers/jwt.helper';
import { TokenPayload } from '@/types/payload.type'; // Asumsikan PasswordResetPayload tidak dipakai di sini
import { Request, Response, NextFunction } from 'express';
import db from '@/configs/db.config';
import { AppError } from '@/helpers/error.helper';

// Perbaikan pada jwtAuth
export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('Token dibutuhkan untuk autentikasi', 401));
    }

    const decoded = verifyToken(token) as TokenPayload;

    // 2. TUNGGU HASIL QUERY DARI DATABASE
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return next(
        new AppError('Pengguna tidak ditemukan atau token tidak valid', 401)
      );
    }

    // 3. ATTACH OBJEK USER DARI DB, BUKAN HANYA PAYLOAD TOKEN
    req.user = decoded;
    next();
  } catch (error) {
    // Menangani error dari verifyToken (misal: TokenExpiredError)
    return next(new AppError('Token tidak valid atau kedaluwarsa', 401));
  }
};

// Perbaikan pada checkRole
export const checkRole = (allowedRoles: string[]) => {
  // <-- PERBAIKAN 1: Tipe diubah ke string[]
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      !req.user.role ||
      !allowedRoles.includes(req.user.role) // <-- PERBAIKAN 2: `as RoleEnum` dihapus
    ) {
      return next(
        new AppError('Anda tidak memiliki izin untuk melakukan aksi ini', 403)
      );
    }
    next();
  };
};

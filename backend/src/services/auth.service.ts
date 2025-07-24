import bcrypt from 'bcryptjs';
import { LoginRequest, RegisterRequest } from '@/types/auth.type';
import db from '@/configs/db.config';
import { UserData } from '@/types/payload.type';
import { generateToken } from '@/helpers/jwt.helper';
import { AppError } from '@/helpers/error.helper';

interface LoginResult {
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  /**
   * Mengotentikasi pengguna dan mengembalikan JWT jika berhasil.
   * @param loginData - Objek berisi email dan password.
   * @returns {LoginResult}.
   * @throws {AppError} jika kredensial tidak valid.
   */
  public async login(loginData: LoginRequest): Promise<LoginResult> {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new AppError('Email dan password harus diisi', 400);
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      // Pesan error generik untuk keamanan
      throw new AppError('Email atau password salah', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Email atau password salah', 401);
    }

    // Data yang akan dimasukkan ke dalam token
    const userDataForToken: UserData = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };

    const token = generateToken(userDataForToken);
    return {
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}

import jwt from 'jsonwebtoken';
import { AppError } from './error.helper';
import {
  PasswordResetPayload,
  TokenPayload,
  UserData,
} from '@/types/payload.type';

/**
 * Generate JWT token for regular authentication
 * @param userData - User data to encode in token
 * @returns JWT token string
 */
export const generateToken = (userData: UserData): string => {
  if (!userData.id || !userData.email || !userData.role) {
    throw new AppError('Missing required user data: userId, email, role', 400);
  }

  const expiresIn: number = parseInt(process.env.JWT_EXPIRES_IN || '86400'); // 24 hours

  const tokenPayload: TokenPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    iat: Math.floor(Date.now() / 1000),
  };

  try {
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET is not defined', 500);
    }

    return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new AppError('Error generating token', 500);
  }
};

/**
 * Generate JWT token for password reset (only requires userId)
 * @param userId - User's UUID
 * @returns JWT token string
 */
export const generatePasswordResetToken = (id: string): string => {
  if (!id) {
    throw new AppError('Missing required field: userId', 400);
  }

  const expiresIn: number = 3600; // 1 hour in seconds

  const tokenPayload: PasswordResetPayload = {
    id,
    isPasswordReset: true,
    iat: Math.floor(Date.now() / 1000),
  };

  try {
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET is not defined', 500);
    }

    return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new AppError('Error generating password reset token', 500);
  }
};

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 */
export const verifyToken = (
  token: string
): TokenPayload | PasswordResetPayload => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET is not defined', 500);
    }
    return jwt.verify(token, process.env.JWT_SECRET) as
      | TokenPayload
      | PasswordResetPayload;
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

export const isAuthenticated = (
  user: TokenPayload | PasswordResetPayload
): user is TokenPayload => {
  return !user.isPasswordReset;
};

/**
 * Helper function to check if token is for password reset
 */
export const isPasswordResetToken = (
  user: TokenPayload | PasswordResetPayload
): user is PasswordResetPayload => {
  return user.isPasswordReset === true;
};

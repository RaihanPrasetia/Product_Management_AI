export interface UserData {
  id: string;
  email: string;
  role: string;
}

export interface TokenPayload extends UserData {
  isPasswordReset?: boolean;
  iat?: number;
}

// Password reset token payload (only needs userId)
export interface PasswordResetPayload {
  id: string;
  isPasswordReset: boolean;
  iat?: number;
  role?: string;
}

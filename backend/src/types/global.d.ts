import { PasswordResetPayload, TokenPayload } from './payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | PasswordResetPayload;
    }
  }
}

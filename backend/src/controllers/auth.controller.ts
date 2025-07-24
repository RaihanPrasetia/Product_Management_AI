import { AuthService } from '@/services/auth.service';
import { Request, Response, NextFunction } from 'express';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, user } = await this.authService.login(req.body);
      res.status(200).json({
        status: 'success',
        success: true,
        token,
        user,
      });
    } catch (error) {
      // Teruskan error ke global error handler
      next(error);
    }
  }
}

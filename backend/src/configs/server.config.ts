import { Application, Request, Response, NextFunction } from "express";

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

interface NotFoundResponse {
  success: false;
  message: string;
}

const configureErrorHandling = (app: Application): void => {
  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const errorResponse: ErrorResponse = {
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    };

    res.status(500).json(errorResponse);
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    const notFoundResponse: NotFoundResponse = {
      success: false,
      message: "Route not found",
    };

    res.status(404).json(notFoundResponse);
  });
};

export default configureErrorHandling;

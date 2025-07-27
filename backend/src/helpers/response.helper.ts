import { Response } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public success: boolean;
  public status: 'fail' | 'error';

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.success = false;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

interface SuccessResponseOptions<T> {
  data: T;
  message?: string;
  pagination?: object;
  statusCode?: number;
}

export class ResponseHelper {
  /**
   * Mengirim respons sukses yang terstandardisasi.
   * @param res - Objek Response dari Express.
   * @param options - Opsi untuk respons, termasuk data, pesan, dll.
   */
  public static success<T>(
    res: Response,
    options: SuccessResponseOptions<T>
  ): void {
    const { data, message = 'Success', pagination, statusCode = 200 } = options;

    const responseBody: any = {
      success: true,
      message,
      data,
    };

    // Tambahkan pagination hanya jika ada
    if (pagination) {
      responseBody.pagination = pagination;
    }

    res.status(statusCode).json(responseBody);
  }
}

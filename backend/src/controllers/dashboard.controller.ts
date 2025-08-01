import { Request, Response, NextFunction } from 'express';
import DashboardService from '@/services/dashboard.service';

class DashboardController {
  // Mengganti getSummary dengan metode yang lebih canggih
  public getSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 1. Ambil startDate dan endDate dari query string
      const { startDate: startDateStr, endDate: endDateStr } = req.query;

      // 2. Tentukan periode waktu: default 30 hari terakhir jika tidak ada query
      // Atur endDate ke akhir hari untuk mencakup semua data pada hari itu
      const endDate = endDateStr ? new Date(endDateStr as string) : new Date();
      endDate.setHours(23, 59, 59, 999);

      // Atur startDate ke awal hari
      const startDate = startDateStr
        ? new Date(startDateStr as string)
        : new Date(new Date().setDate(endDate.getDate() - 29)); // 30 hari termasuk hari ini
      startDate.setHours(0, 0, 0, 0);

      // 3. Validasi sederhana
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        // Asumsi Anda memiliki error handler middleware
        // Gantilah 'Error' dengan kelas AppError kustom Anda jika ada
        return next(
          new Error('Format tanggal tidak valid. Gunakan format YYYY-MM-DD.')
        );
      }

      // 4. Panggil service dengan periode yang sudah ditentukan
      const summaryData = await DashboardService.getAdvancedSummary({
        startDate,
        endDate,
      });

      res.status(200).json({
        success: true,
        message: 'Data summary dashboard berhasil diambil',
        data: summaryData,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new DashboardController();

import { Request, Response, NextFunction } from 'express';
import DashboardService from '@/services/dashboard.service';

class DashboardController {
  public getSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const summaryData = await DashboardService.getSummary();
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

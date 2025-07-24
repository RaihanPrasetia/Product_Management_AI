import { success } from 'zod';
import { Request, Response, NextFunction } from 'express';
import StockService from '@/services/stock.service';
import {
  adjustStockSchema,
  getStockHistoryParamsSchema,
  paginationQuerySchema,
} from '@/validations/stock.validation';

class StockController {
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stocks = await StockService.findAll();
      res
        .status(200)
        .json({ success: true, message: 'Data stok berhasil diambil', stocks });
    } catch (error) {
      next(error);
    }
  };

  public adjust = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = adjustStockSchema.parse(req.body);
      const updatedStock = await StockService.adjustStock(validatedData);
      res.status(200).json({
        success: true,
        message: 'Stok berhasil disesuaikan',
        stock: updatedStock,
      });
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validasi parameter URL dan query
      const { stockId } = getStockHistoryParamsSchema.parse(req.params);
      const { page, limit } = paginationQuerySchema.parse(req.query);

      // Hitung skip untuk paginasi
      const skip = (page - 1) * limit;

      const { history, total } = await StockService.findHistoryByStockId(
        stockId,
        {
          take: limit,
          skip,
        }
      );

      res.status(200).json({
        message: 'Riwayat stok berhasil diambil',
        data: history,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new StockController();

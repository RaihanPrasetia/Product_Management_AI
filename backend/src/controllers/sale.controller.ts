import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '@/helpers/response.helper';
import SaleService from '@/services/sale.service';
import {
  CreateSaleInput,
  UpdateSaleInput,
} from '@/validations/sale.validation';
import db from '@/configs/db.config';
import { createQueryOptions } from '@/helpers/prisma.helper';

class SaleController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const saleData: CreateSaleInput = req.body;
      const createdById = (req as any).user.id; // Asumsi Anda punya data user dari middleware auth

      const newSale = await SaleService.create(saleData, createdById);

      ResponseHelper.success(res, {
        data: newSale,
        message: 'Transaksi penjualan berhasil dibuat',
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prismaArgs, pagination } = await createQueryOptions(
        db.sale,
        req.query
      );

      const sales = await SaleService.findAll(prismaArgs);

      ResponseHelper.success(res, {
        data: sales,
        pagination,
        message: 'Berhasil mendapatkan data penjualan',
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const sale = await SaleService.findById(id);
      ResponseHelper.success(res, {
        data: sale,
        message: 'Berhasil mendapatkan data penjualan',
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const saleData: UpdateSaleInput = req.body;

      const updatedSale = await SaleService.update(id, saleData);

      ResponseHelper.success(res, {
        data: updatedSale,
        message: 'Transaksi penjualan berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new SaleController();

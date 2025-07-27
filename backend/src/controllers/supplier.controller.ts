import { Request, Response, NextFunction } from 'express';
import SupplierService from '@/services/supplier.service';
import {
  createSupplierSchema,
  updateSupplierSchema,
} from '@/validations/supplier.validation';
import { success } from 'zod';
import db from '@/configs/db.config';
import { createQueryOptions } from '@/helpers/prisma.helper';
import { ResponseHelper } from '@/helpers/response.helper';

class SupplierController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createSupplierSchema.parse(req.body);
      const newSupplier = await SupplierService.create(
        validatedData,
        req.user!.id
      );
      res.status(201).json({
        success: true,
        message: 'Supplier berhasil dibuat',
        supplier: newSupplier,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prismaArgs, pagination } = await createQueryOptions(
        db.supplier,
        req.query
      );
      const suppliers = await SupplierService.findAll(prismaArgs);
      ResponseHelper.success(res, {
        data: suppliers,
        pagination,
        message: 'Berhasil mendapatkan data supplier',
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const supplier = await SupplierService.findById(id);
      res.status(200).json({ success: true, supplier });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateSupplierSchema.parse(req.body);
      const updatedSupplier = await SupplierService.update(id, data);
      res.status(200).json({
        success: true,
        message: 'Supplier berhasil diupdate',
        supplier: updatedSupplier,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await SupplierService.delete(id);
      res
        .status(200)
        .json({ success: true, message: 'Supplier berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };

  public restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const supplier = await SupplierService.restore(id);
      ResponseHelper.success(res, {
        data: supplier,
        message: 'Berhasil mendapatkan data supplier',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new SupplierController();

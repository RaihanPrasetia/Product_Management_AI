import { Request, Response, NextFunction } from 'express';
import VariantService from '@/services/variant.service';
import {
  createVariantSchema,
  updateVariantSchema,
} from '@/validations/variant.validation';
import { success } from 'zod';
import db from '@/configs/db.config';
import { ResponseHelper } from '@/helpers/response.helper';
import { createQueryOptions } from '@/helpers/prisma.helper';

class VariantController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createVariantSchema.parse(req.body);
      const newVariant = await VariantService.create(data, req.user!.id);
      res.status(201).json({
        success: true,
        message: 'Varian berhasil dibuat',
        variant: newVariant,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prismaArgs, pagination } = await createQueryOptions(
        db.variant,
        req.query
      );
      const variants = await VariantService.findAll(prismaArgs);
      ResponseHelper.success(res, {
        data: variants,
        pagination,
        message: 'Berhasil mendapatkan data variant',
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const variant = await VariantService.findById(id);
      res.status(200).json({ success: true, variant });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateVariantSchema.parse(req.body);
      const updatedVariant = await VariantService.update(id, data);
      res.status(200).json({
        success: true,
        message: 'Varian berhasil diupdate',
        variant: updatedVariant,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await VariantService.delete(id);
      res
        .status(200)
        .json({ success: true, message: 'Varian berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };

  public restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const variant = await VariantService.restore(id);
      ResponseHelper.success(res, {
        data: variant,
        message: 'Berhasil mendapatkan data variant',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new VariantController();

import { Request, Response, NextFunction } from 'express';
import CategoryService from '@/services/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/validations/category.validation';
import db from '@/configs/db.config';
import { createQueryOptions } from '@/helpers/prisma.helper';
import { ResponseHelper } from '@/helpers/response.helper';

class CategoryController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCategorySchema.parse(req.body);
      const newCategory = await CategoryService.create(data, req.user!.id);
      res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        category: newCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prismaArgs, pagination } = await createQueryOptions(
        db.category,
        req.query
      );
      const categories = await CategoryService.findAll(prismaArgs);
      ResponseHelper.success(res, {
        data: categories,
        pagination,
        message: 'Berhasil mendapatkan data kategori',
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await CategoryService.findById(id);
      res.status(200).json({ success: true, category });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateCategorySchema.parse(req.body);
      const updatedCategory = await CategoryService.update(id, data);
      res.status(200).json({
        success: true,
        message: 'Kategori berhasil diupdate',
        category: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await CategoryService.delete(id);
      res
        .status(200)
        .json({ success: true, message: 'Kategori berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();

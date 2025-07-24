import { Request, Response, NextFunction } from 'express';
import BrandService from '@/services/brand.service';
import {
  createBrandSchema,
  updateBrandSchema,
} from '@/validations/brand.validation';

class BrandController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createBrandSchema.parse(req.body);
      const newBrand = await BrandService.create(data, req.user!.id);
      res.status(201).json({
        success: true,
        message: 'Merk berhasil dibuat',
        brand: newBrand,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await BrandService.findAll();
      res.status(200).json({ success: true, brands });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const brand = await BrandService.findById(id);
      res.status(200).json({ success: true, brand });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateBrandSchema.parse(req.body);
      const updatedBrand = await BrandService.update(id, data);
      res.status(200).json({
        success: true,
        message: 'Merk berhasil diupdate',
        brand: updatedBrand,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await BrandService.delete(id);
      res.status(200).json({ success: true, message: 'Merk berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };
}

export default new BrandController();

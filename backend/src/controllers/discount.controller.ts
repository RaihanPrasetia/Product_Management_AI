import { Request, Response, NextFunction } from 'express';
import DiscountService from '@/services/discount.service';
import {
  createDiscountSchema,
  updateDiscountSchema,
} from '@/validations/discount.validation';

class DiscountController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createDiscountSchema.parse(req.body);

      const newDiscount = await DiscountService.create(data, req.user!.id);
      res
        .status(201)
        .json({ message: 'Diskon berhasil dibuat', data: newDiscount });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await DiscountService.findAll();
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const discount = await DiscountService.findById(id);
      res.status(200).json({ data: discount });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = updateDiscountSchema.parse(req.body);
      const updatedDiscount = await DiscountService.update(id, data);
      res
        .status(200)
        .json({ message: 'Diskon berhasil diupdate', data: updatedDiscount });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await DiscountService.delete(id);
      res.status(200).json({ message: 'Diskon berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };
}

export default new DiscountController();

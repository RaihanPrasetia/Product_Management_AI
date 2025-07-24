import { Request, Response, NextFunction } from 'express';
import PurchaseService from '@/services/purchase.service';
import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from '@/validations/purchase.validation';

class PurchaseController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createPurchaseSchema.parse(req.body);
      const newPurchase = await PurchaseService.create(
        validatedData,
        req.user!.id
      );
      res.status(201).json({
        success: true,
        message: 'Data pembelian berhasil dibuat',
        purchase: newPurchase,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const purchases = await PurchaseService.findAll();
      res.status(200).json({ success: true, purchases });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const purchase = await PurchaseService.findById(id);
      res.status(200).json({ success: true, purchase });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Ambil ID dari parameter URL
      const { id } = req.params;

      // 2. Validasi data dari body menggunakan skema update
      const validatedData = updatePurchaseSchema.parse(req.body);

      // 3. Panggil service untuk melakukan update
      const updatedPurchase = await PurchaseService.update(
        id,
        validatedData,
        req.user!.id
      );

      res.status(200).json({
        message: 'Data pembelian berhasil diupdate',
        data: updatedPurchase,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new PurchaseController();

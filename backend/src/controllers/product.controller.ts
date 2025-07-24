// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import ProductService from '@/services/product.service'; // Impor instance service
import {
  createProductSchema,
  updateProductSchema,
} from '@/validations/product.validation';
import { success } from 'zod';

class ProductController {
  // Gunakan arrow function untuk auto-binding `this` context
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createProductSchema.parse(req.body);
      const product = await ProductService.create(validatedData, req.user!.id);
      res
        .status(201)
        .json({ message: 'Produk berhasil dibuat', data: product });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { includeDeleted } = req.query;

      // Siapkan options untuk service
      const options = {
        // Konversi string "true" dari query menjadi boolean
        includeDeleted: includeDeleted === 'true',
      };

      // Panggil service dengan options
      const products = await ProductService.findAll(options);

      res.status(200).json({
        success: true,
        message: 'Berhasil mendapatkan data produk',
        result: products.length,
        products,
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await ProductService.findById(id);
      res.status(200).json({
        success: true,
        message: 'Berhasil mendapatkan data product',
        product,
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);
      const product = await ProductService.update(
        id,
        validatedData,
        req.user!.id
      );
      res
        .status(200)
        .json({ message: 'Produk berhasil diupdate', data: product });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await ProductService.delete(id);
      res
        .status(200)
        .json({ success: true, message: 'Produk berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  };
  public restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await ProductService.restore(id);
      res
        .status(200)
        .json({ success: true, message: 'Produk berhasil dipulihkan' });
    } catch (error) {
      next(error);
    }
  };
}

// Ekspor sebagai singleton instance
export default new ProductController();

// src/stores/product.store.ts

import { create } from 'zustand';
import { productService } from '@/services/productService';
import { Product } from '@/types/ProductType';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type ProductState = PaginationState<Product> & {
  deleteProduct: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreProduct: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useProductStore = create<ProductState>((set, get, api) => ({
  ...createPaginationSlice<Product>(productService.getAll)(set, get, api),

  deleteProduct: async (id, showNotification) => {
    try {
      const res = await productService.delete(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal menghapus produk';
      showNotification(message, 'error');
    }
  },

  restoreProduct: async (id, showNotification) => {
    try {
      const res = await productService.restore(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memulihkan produk';
      showNotification(message, 'error');
    }
  },
}));

// src/stores/product.store.ts

import { create } from 'zustand';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Brand } from '@/types/BrandType';
import { brandService } from '@/services/brandService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type BrandState = PaginationState<Brand> & {
  deleteData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useBrandStore = create<BrandState>((set, get, api) => ({
  ...createPaginationSlice<Brand>(brandService.getAll)(set, get, api),

  deleteData: async (id, showNotification) => {
    try {
      const res = await brandService.delete(id);
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

  restoreData: async (id, showNotification) => {
    try {
      const res = await brandService.restore(id);
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

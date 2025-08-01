// src/stores/product.store.ts

import { create } from 'zustand';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Sale } from '@/types/SaleType';
import { saleService } from '@/services/saleService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type SaleState = PaginationState<Sale> & {
  deleteData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useSaleStore = create<SaleState>((set, get, api) => ({
  ...createPaginationSlice<Sale>(saleService.getAll)(set, get, api),

  deleteData: async (id, showNotification) => {
    try {
      const res = await saleService.delete(id);
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
      const res = await saleService.restore(id);
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

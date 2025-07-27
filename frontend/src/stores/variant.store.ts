// src/stores/product.store.ts

import { create } from 'zustand';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Variant } from '@/types/VariantType';
import { variantService } from '@/services/variantService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type VariantState = PaginationState<Variant> & {
  deleteData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useVariantStore = create<VariantState>((set, get, api) => ({
  ...createPaginationSlice<Variant>(variantService.getAll)(set, get, api),

  deleteData: async (id, showNotification) => {
    try {
      const res = await variantService.delete(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal menghapus Variant';
      showNotification(message, 'error');
    }
  },

  restoreData: async (id, showNotification) => {
    try {
      const res = await variantService.restore(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memulihkan Variant';
      showNotification(message, 'error');
    }
  },
}));

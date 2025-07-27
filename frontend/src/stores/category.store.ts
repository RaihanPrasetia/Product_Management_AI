// src/stores/product.store.ts

import { create } from 'zustand';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Category } from '@/types/CategoryType';
import { categoryService } from '@/services/categoryService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type CategoryState = PaginationState<Category> & {
  deleteData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get, api) => ({
  ...createPaginationSlice<Category>(categoryService.getAll)(set, get, api),

  deleteData: async (id, showNotification) => {
    try {
      const res = await categoryService.delete(id);
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
      const res = await categoryService.restore(id);
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

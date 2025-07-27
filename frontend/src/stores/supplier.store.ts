// src/stores/product.store.ts

import { create } from 'zustand';
import { ShowNotificationFn } from '@/utils/NotificationType';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Supplier } from '@/types/SupplierType';
import { supplierService } from '@/services/supplierService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type SupplierState = PaginationState<Supplier> & {
  deleteData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
  restoreData: (
    id: string,
    showNotification: ShowNotificationFn
  ) => Promise<void>;
};

export const useSupplierStore = create<SupplierState>((set, get, api) => ({
  ...createPaginationSlice<Supplier>(supplierService.getAll)(set, get, api),

  deleteData: async (id, showNotification) => {
    try {
      const res = await supplierService.delete(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal menghapus Supplier';
      showNotification(message, 'error');
    }
  },

  restoreData: async (id, showNotification) => {
    try {
      const res = await supplierService.restore(id);
      if (res.success) {
        showNotification(res.message, 'success');
        get().fetchData();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memulihkan Supplier';
      showNotification(message, 'error');
    }
  },
}));

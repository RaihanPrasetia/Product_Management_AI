// src/stores/product.store.ts

import { create } from 'zustand';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Purchase } from '@/types/PurchaseType';
import { purchaseService } from '@/services/purchaseService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type PurchaseState = PaginationState<Purchase>;

export const usePurchaseStore = create<PurchaseState>((set, get, api) => ({
  ...createPaginationSlice<Purchase>(purchaseService.getAll)(set, get, api),
}));

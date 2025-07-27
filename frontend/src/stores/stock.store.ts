// src/stores/product.store.ts

import { create } from 'zustand';
import { createPaginationSlice, PaginationState } from './pagination.slice';
import { Stock } from '@/types/StockType';
import { stockService } from '@/services/stockService';

// -> 2. Gabungkan tipe state dari slice dengan state/aksi spesifik produk
type StockState = PaginationState<Stock>;

export const useStockStore = create<StockState>((set, get, api) => ({
  ...createPaginationSlice<Stock>(stockService.getAll)(set, get, api),
}));

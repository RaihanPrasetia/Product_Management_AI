// src/stores/pagination.slice.ts
import { StateCreator } from 'zustand';
import { ApiParams, ApiResponse, Pagination } from '@/types/apiTypes';

// -> FIX: Ubah key dari 'searchTerm' menjadi 'name_contains' agar konsisten
export type FilterKeys =
  | keyof Omit<ApiParams, 'page' | 'limit'>
  | 'page'
  | 'limit';

export interface PaginationState<T> {
  data: T[];
  pagination: Pagination;
  filters: ApiParams; // Menggunakan ApiParams secara langsung
  loading: boolean;
  error: string | null;
  setFilter: (key: FilterKeys, value: string | number) => void;
  setSort: (orderBy: string) => void;
  fetchData: () => Promise<void>;
}

let debounceTimeout: NodeJS.Timeout;

export const createPaginationSlice =
  <T>(
    fetchService: (params: any) => Promise<ApiResponse<T>>
  ): StateCreator<PaginationState<T>> =>
  (set, get) => ({
    data: [],
    pagination: { total: 0, totalPages: 1, currentPage: 1, limit: 5 },
    filters: {
      page: 1,
      limit: 5,
      name_contains: '',
      orderDirection: 'desc',
    },
    loading: true,
    error: null,
    setSort: (orderByValue: string) => {
      set((state) => {
        const { orderBy, orderDirection } = state.filters;
        // Jika kolom sama, balik arahnya. Jika beda, set default ke 'asc'.
        const newOrderDirection =
          orderBy === orderByValue && orderDirection === 'asc' ? 'desc' : 'asc';
        return {
          filters: {
            ...state.filters,
            orderBy: orderByValue,
            orderDirection: newOrderDirection,
            page: 1, // Selalu kembali ke halaman 1 saat sorting diubah
          },
        };
      });
      get().fetchData();
    },

    setFilter: (key, value) => {
      set((state) => {
        const newFilters = { ...state.filters, [key]: value };
        if (key !== 'page') {
          newFilters.page = 1;
        }
        newFilters.page = Number(newFilters.page);
        newFilters.limit = Number(newFilters.limit);
        return { filters: newFilters };
      });

      clearTimeout(debounceTimeout);
      // -> FIX: Cek 'name_contains' untuk debounce
      if (key === 'name_contains') {
        debounceTimeout = setTimeout(() => get().fetchData(), 500);
      } else {
        get().fetchData();
      }
    },

    fetchData: async () => {
      set({ loading: true, error: null });
      const { filters } = get();

      // -> FIX: Buat params lebih bersih dan hapus properti kosong
      const params: ApiParams = {
        page: filters.page,
        limit: filters.limit,
        orderBy: filters.orderBy,
        orderDirection: filters.orderDirection,
      };
      // Hanya tambahkan name_contains jika tidak kosong
      if (filters.name_contains) {
        params.name_contains = filters.name_contains;
      }

      try {
        const response = await fetchService(params);
        set({
          data: response.data,
          pagination: response.pagination,
          loading: false,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Gagal mengambil data';
        set({ error: message, loading: false });
      }
    },
  });

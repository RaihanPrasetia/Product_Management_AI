import axios from 'axios';
import api from '../axios';
import { StockRequest, StockApiResponse } from '@/utils/types/StockType';

class StockApiService {
  /**
   * Menangani error dari Axios dan mengembalikan pesan yang bersih.
   */
  private _handleApiError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const apiMessage = error.response?.data?.message;
      return new Error(apiMessage || defaultMessage);
    }
    return new Error('Terjadi kesalahan yang tidak diketahui');
  }

  /**
   * Mengambil semua kategori dengan filter opsional.
   */
  public async getAll(): Promise<StockApiResponse> {
    try {
      const response = await api.get<StockApiResponse>('/stocks');
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  public async getHistory(id: string): Promise<StockApiResponse> {
    try {
      const response = await api.get<StockApiResponse>(`/stocks/${id}/history`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Mengupdate kategori yang ada.
   */
  public async update(data: Partial<StockRequest>): Promise<StockApiResponse> {
    try {
      const response = await api.patch<StockApiResponse>(
        `/stocks/adjust`,
        data
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui kategori');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const stockService = new StockApiService();

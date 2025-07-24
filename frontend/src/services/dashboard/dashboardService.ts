import axios from 'axios';
import api from '../axios';
import { DashboardApiResponse } from '@/utils/types/DashboardType';

class DashboardApiService {
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
  public async getSummary(): Promise<DashboardApiResponse> {
    try {
      const response = await api.get<DashboardApiResponse>(
        '/dashboard/summary'
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data dashboard');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const dashboardService = new DashboardApiService();

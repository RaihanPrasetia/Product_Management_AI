import axios from 'axios';
import api from '../utils/axios';
import { SingleApiResponse } from '@/types/apiTypes';
import { Dashboard } from '@/types/DashboardType';

interface getSummaryParams {
  startDate: Date;
  endDate: Date;
}
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
  public async getSummary(
    params?: getSummaryParams
  ): Promise<SingleApiResponse<Dashboard>> {
    try {
      const response = await api.get<SingleApiResponse<Dashboard>>(
        '/dashboard/summary',
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data dashboard');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const dashboardService = new DashboardApiService();

import axios from 'axios';
import api from '../axios';
import {
  SupplierRequest,
  SupplierApiResponse,
} from '@/utils/types/SupplierType';

class SupplierApiService {
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
   * Mengambil semua supplier dengan filter opsional.
   */
  public async getAll(): Promise<SupplierApiResponse> {
    try {
      const response = await api.get<SupplierApiResponse>('/suppliers');
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data supplier');
    }
  }

  /**
   * Mengambil satu supplier berdasarkan ID.
   */
  public async getById(id: string): Promise<SupplierApiResponse> {
    try {
      const response = await api.get<SupplierApiResponse>(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data supplier');
    }
  }

  /**
   * Membuat supplier baru.
   */
  public async create(data: SupplierRequest): Promise<SupplierApiResponse> {
    try {
      const response = await api.post<SupplierApiResponse>('/suppliers', data);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal membuat supplier');
    }
  }

  /**
   * Mengupdate supplier yang ada.
   */
  public async update(
    id: string,
    data: Partial<SupplierRequest>
  ): Promise<SupplierApiResponse> {
    try {
      const response = await api.patch<SupplierApiResponse>(
        `/suppliers/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui supplier');
    }
  }

  /**
   * Menghapus supplier (soft delete).
   */
  public async delete(id: string): Promise<SupplierApiResponse> {
    try {
      const response = await api.delete<SupplierApiResponse>(
        `/suppliers/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus supplier');
    }
  }

  /**
   * Memulihkan supplier yang sudah dihapus.
   */
  public async restore(id: string): Promise<SupplierApiResponse> {
    try {
      const response = await api.post<SupplierApiResponse>(
        `/suppliers/${id}/restore`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan supplier');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const supplierService = new SupplierApiService();

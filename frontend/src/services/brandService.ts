import axios from 'axios';
import api from '../utils/axios';
import { BrandRequest, Brand } from '@/types/BrandType';
import { ApiParams, ApiResponse, SingleApiResponse } from '@/types/apiTypes';

class BrandApiService {
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
  public async getAll(params?: ApiParams): Promise<ApiResponse<Brand>> {
    try {
      const response = await api.get<ApiResponse<Brand>>('/brands', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Mengambil satu kategori berdasarkan ID.
   */
  public async getById(id: string): Promise<SingleApiResponse<Brand>> {
    try {
      const response = await api.get<SingleApiResponse<Brand>>(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Membuat kategori baru.
   */
  public async create(data: BrandRequest): Promise<SingleApiResponse<Brand>> {
    try {
      const response = await api.post<SingleApiResponse<Brand>>(
        '/brands',
        data
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal membuat kategori');
    }
  }

  /**
   * Mengupdate kategori yang ada.
   */
  public async update(
    id: string,
    data: Partial<BrandRequest>
  ): Promise<SingleApiResponse<Brand>> {
    try {
      const response = await api.patch<SingleApiResponse<Brand>>(
        `/brands/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui kategori');
    }
  }

  /**
   * Menghapus kategori (soft delete).
   */
  public async delete(id: string): Promise<SingleApiResponse<Brand>> {
    try {
      const response = await api.delete<SingleApiResponse<Brand>>(
        `/brands/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus kategori');
    }
  }

  /**
   * Memulihkan kategori yang sudah dihapus.
   */
  public async restore(id: string): Promise<SingleApiResponse<Brand>> {
    try {
      const response = await api.post<SingleApiResponse<Brand>>(
        `/brands/${id}/restore`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan kategori');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const brandService = new BrandApiService();

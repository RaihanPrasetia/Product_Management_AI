import axios from 'axios';
import api from '../utils/axios';
import {
  VariantRequest,
  VariantApiResponse,
  Variant,
} from '@/types/VariantType';
import { ApiParams, ApiResponse } from '@/types/apiTypes';

class VariantApiService {
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
  public async getAll(params?: ApiParams): Promise<ApiResponse<Variant>> {
    try {
      const response = await api.get<ApiResponse<Variant>>('/variants', {
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
  public async getById(id: string): Promise<VariantApiResponse> {
    try {
      const response = await api.get<VariantApiResponse>(`/variants/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Membuat kategori baru.
   */
  public async create(data: VariantRequest): Promise<VariantApiResponse> {
    try {
      const response = await api.post<VariantApiResponse>('/variants', data);
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
    data: Partial<VariantRequest>
  ): Promise<VariantApiResponse> {
    try {
      const response = await api.patch<VariantApiResponse>(
        `/variants/${id}`,
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
  public async delete(id: string): Promise<VariantApiResponse> {
    try {
      const response = await api.delete<VariantApiResponse>(`/variants/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus kategori');
    }
  }

  /**
   * Memulihkan kategori yang sudah dihapus.
   */
  public async restore(id: string): Promise<VariantApiResponse> {
    try {
      const response = await api.post<VariantApiResponse>(
        `/variants/${id}/restore`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan kategori');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const variantService = new VariantApiService();

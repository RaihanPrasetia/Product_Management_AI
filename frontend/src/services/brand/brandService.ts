import axios from 'axios';
import api from '../axios';
import { BrandRequest, BrandApiResponse } from '@/utils/types/BrandType';

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
  public async getAll(): Promise<BrandApiResponse> {
    try {
      const response = await api.get<BrandApiResponse>('/brands');
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Mengambil satu kategori berdasarkan ID.
   */
  public async getById(id: string): Promise<BrandApiResponse> {
    try {
      const response = await api.get<BrandApiResponse>(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Membuat kategori baru.
   */
  public async create(data: BrandRequest): Promise<BrandApiResponse> {
    try {
      const response = await api.post<BrandApiResponse>('/brands', data);
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
  ): Promise<BrandApiResponse> {
    try {
      const response = await api.patch<BrandApiResponse>(`/brands/${id}`, data);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui kategori');
    }
  }

  /**
   * Menghapus kategori (soft delete).
   */
  public async delete(id: string): Promise<BrandApiResponse> {
    try {
      const response = await api.delete<BrandApiResponse>(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus kategori');
    }
  }

  /**
   * Memulihkan kategori yang sudah dihapus.
   */
  public async restore(id: string): Promise<BrandApiResponse> {
    try {
      const response = await api.post<BrandApiResponse>(
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

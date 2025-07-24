import axios from 'axios';
import api from '../axios';
import {
  CategoryRequest,
  CategoryApiResponse,
} from '@/utils/types/CategoryType';

class CategoryApiService {
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
  public async getAll(): Promise<CategoryApiResponse> {
    try {
      const response = await api.get<CategoryApiResponse>('/categories');
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Mengambil satu kategori berdasarkan ID.
   */
  public async getById(id: string): Promise<CategoryApiResponse> {
    try {
      const response = await api.get<CategoryApiResponse>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }

  /**
   * Membuat kategori baru.
   */
  public async create(data: CategoryRequest): Promise<CategoryApiResponse> {
    try {
      const response = await api.post<CategoryApiResponse>('/categories', data);
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
    data: Partial<CategoryRequest>
  ): Promise<CategoryApiResponse> {
    try {
      const response = await api.patch<CategoryApiResponse>(
        `/categories/${id}`,
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
  public async delete(id: string): Promise<CategoryApiResponse> {
    try {
      const response = await api.delete<CategoryApiResponse>(
        `/categories/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus kategori');
    }
  }

  /**
   * Memulihkan kategori yang sudah dihapus.
   */
  public async restore(id: string): Promise<CategoryApiResponse> {
    try {
      const response = await api.post<CategoryApiResponse>(
        `/category/${id}/restore`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan kategori');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const categoryService = new CategoryApiService();

import { UpdateSaleRequest } from './../types/SaleType';
import axios from 'axios';
import api from '../utils/axios';
import { ApiParams, ApiResponse, SingleApiResponse } from '@/types/apiTypes';
import { CreateSaleRequest, Sale } from '@/types/SaleType';

class SaleApiService {
  private _handleApiError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      // Ambil pesan error dari response body API jika ada
      const apiMessage = error.response?.data?.message;
      return new Error(apiMessage || defaultMessage);
    }
    // Untuk error yang bukan dari axios
    return new Error('Terjadi kesalahan yang tidak diketahui');
  }

  /**
   * Mengambil semua produk.
   * Mengembalikan seluruh response API termasuk metadata.
   */
  public async getAll(params?: ApiParams): Promise<ApiResponse<Sale>> {
    try {
      // 'params' dikirim sebagai objek config kedua di axios.get
      const response = await api.get<ApiResponse<Sale>>('/sales', {
        params,
      });

      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data produk');
    }
  }

  /**
   * Mengambil satu produk berdasarkan ID.
   * Hanya mengembalikan objek produknya saja.
   */
  public async getById(id: string): Promise<SingleApiResponse<Sale>> {
    try {
      // Asumsi API mengembalikan { success: true, sale: Sale }
      const response = await api.get<SingleApiResponse<Sale>>(`/sales/${id}`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data produk');
    }
  }

  /**
   * Membuat produk baru menggunakan FormData.
   * Mengembalikan produk yang baru dibuat.
   */
  public async create(
    data: CreateSaleRequest
  ): Promise<SingleApiResponse<Sale>> {
    try {
      // Asumsi API mengembalikan { success: true, data: Sale }
      const response = await api.post<SingleApiResponse<Sale>>('/sales', data);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal membuat produk');
    }
  }

  /**
   * Mengupdate produk yang ada menggunakan FormData.
   * Mengembalikan produk yang sudah diupdate.
   */
  public async update(id: string, data: UpdateSaleRequest): Promise<Sale> {
    try {
      const response = await api.patch<{ sale: Sale }>(`/sales/${id}`, data);
      return response.data.sale;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui produk');
    }
  }

  /**
   * Menghapus produk.
   * Tidak mengembalikan apa-apa jika berhasil.
   */
  public async delete(id: string): Promise<SingleApiResponse<Sale>> {
    try {
      const response = await api.delete<SingleApiResponse<Sale>>(
        `/sales/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus produk');
    }
  }

  public async restore(id: string): Promise<SingleApiResponse<Sale>> {
    try {
      const response = await api.post(`/sales/${id}/restore`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan produk');
    }
  }

  /**
   * Mengimpor produk dari file.
   */
  public async import(data: FormData): Promise<ApiResponse<Sale>> {
    try {
      const response = await api.post<ApiResponse<Sale>>('/import/sale', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengimpor produk');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const saleService = new SaleApiService();

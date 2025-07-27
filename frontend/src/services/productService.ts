import axios from 'axios';
import api from '../utils/axios';
import { Product, ProductRequest } from '@/types/ProductType';
import { ApiParams, ApiResponse, SingleApiResponse } from '@/types/apiTypes';

class ProductApiService {
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
  public async getAll(params?: ApiParams): Promise<ApiResponse<Product>> {
    try {
      // 'params' dikirim sebagai objek config kedua di axios.get
      const response = await api.get<ApiResponse<Product>>('/products', {
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
  public async getById(id: string): Promise<SingleApiResponse<Product>> {
    try {
      // Asumsi API mengembalikan { success: true, product: Product }
      const response = await api.get<SingleApiResponse<Product>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data produk');
    }
  }

  /**
   * Membuat produk baru menggunakan FormData.
   * Mengembalikan produk yang baru dibuat.
   */
  public async create(data: ProductRequest): Promise<Product> {
    try {
      // Asumsi API mengembalikan { success: true, data: Product }
      const response = await api.post<{ data: Product }>('/products', data);
      return response.data.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal membuat produk');
    }
  }

  /**
   * Mengupdate produk yang ada menggunakan FormData.
   * Mengembalikan produk yang sudah diupdate.
   */
  public async update(id: string, data: ProductRequest): Promise<Product> {
    try {
      const response = await api.patch<{ product: Product }>(
        `/products/${id}`,
        data
      );
      return response.data.product;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memperbarui produk');
    }
  }

  /**
   * Menghapus produk.
   * Tidak mengembalikan apa-apa jika berhasil.
   */
  public async delete(id: string): Promise<SingleApiResponse<Product>> {
    try {
      const response = await api.delete<SingleApiResponse<Product>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus produk');
    }
  }

  public async restore(id: string): Promise<SingleApiResponse<Product>> {
    try {
      const response = await api.post(`/products/${id}/restore`);
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan produk');
    }
  }

  /**
   * Mengimpor produk dari file.
   */
  public async import(data: FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await api.post<ApiResponse<Product>>(
        '/import/product',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengimpor produk');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const productService = new ProductApiService();

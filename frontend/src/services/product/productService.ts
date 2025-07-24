import axios from 'axios';
import api from '../axios';
import {
  GetAllProductsOptions,
  Product,
  ProductApiResponse,
  ProductRequest,
} from '@/utils/types/ProductType';

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
  public async getAll(
    options?: GetAllProductsOptions
  ): Promise<ProductApiResponse> {
    try {
      const response = await api.get<ProductApiResponse>('/products', {
        params: options,
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
  public async getById(id: string): Promise<ProductApiResponse> {
    try {
      // Asumsi API mengembalikan { success: true, product: Product }
      const response = await api.get<ProductApiResponse>(`/products/${id}`);
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
      console.log('create product', data);
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
      console.log('Data dikirim saat update', data);
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
  public async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw this._handleApiError(error, 'Gagal menghapus produk');
    }
  }

  public async restore(id: string): Promise<void> {
    try {
      await api.post(`/products/${id}/restore`);
    } catch (error) {
      throw this._handleApiError(error, 'Gagal memulihkan produk');
    }
  }

  /**
   * Mengimpor produk dari file.
   */
  public async import(data: FormData): Promise<ProductApiResponse> {
    try {
      const response = await api.post<ProductApiResponse>(
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

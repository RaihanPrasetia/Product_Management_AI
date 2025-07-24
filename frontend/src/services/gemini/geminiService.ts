import axios from 'axios';
import api from '../axios';

interface ChatResponse {
  reply: string;
}

class GeminiApiService {
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
  public async chat(message: string): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat', { message });
      return response.data;
    } catch (error) {
      throw this._handleApiError(error, 'Gagal mengambil data kategori');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const geminiService = new GeminiApiService();

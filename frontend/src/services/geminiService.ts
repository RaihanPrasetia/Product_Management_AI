import axios from 'axios';
import api from '../utils/axios';

// -> NEW: Definisikan tipe untuk history agar konsisten dengan front-end & back-end
interface HistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// -> NEW: Definisikan tipe untuk payload yang dikirim ke API
interface ChatPayload {
  message: string;
  history: HistoryItem[];
}

// -> FIX: Perbarui tipe respons untuk menyertakan history
interface ChatResponse {
  reply: string;
  history: HistoryItem[];
}

class GeminiApiService {
  /**
   * Menangani error dari Axios dan mengembalikan pesan yang bersih.
   */
  private _handleApiError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      // Mengambil pesan error dari respons API backend jika ada
      const apiMessage =
        error.response?.data?.message || error.response?.data?.reply;
      return new Error(apiMessage || defaultMessage);
    }
    return new Error('Terjadi kesalahan yang tidak diketahui pada server.');
  }

  /**
   * Mengirim pesan dan history ke AI, lalu menerima balasan dan history baru.
   */
  // -> FIX: Ubah parameter untuk menerima payload lengkap
  public async chat(payload: ChatPayload): Promise<ChatResponse> {
    try {
      // -> FIX: Kirim seluruh payload (message & history)
      const response = await api.post<ChatResponse>('/chat', payload);
      return response.data;
    } catch (error) {
      // -> FIX: Perbarui pesan error default agar lebih relevan
      throw this._handleApiError(error, 'Gagal terhubung dengan AI Assistant');
    }
  }
}

// Ekspor sebagai singleton instance agar mudah digunakan di mana saja
export const geminiService = new GeminiApiService();

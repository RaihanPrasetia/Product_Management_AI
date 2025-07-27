// src/hooks/useChat.ts

import { useState } from 'react';
import { geminiService } from '@/services/gemini/geminiService';

// Definisikan tipe data yang akan kita gunakan
interface Message {
  from: 'user' | 'ai';
  text: string;
}

interface HistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Tambahkan pesan pengguna ke UI
    setMessages((prev) => [...prev, { from: 'user', text: messageText }]);
    setIsLoading(true);

    try {
      const response = await geminiService.chat({
        message: messageText,
        history,
      });

      // Tambahkan respons AI ke UI
      const aiMessage: Message = { from: 'ai', text: response.reply };
      setMessages((prev) => [...prev, aiMessage]);

      // Perbarui state history dengan history baru dari backend
      setHistory(response.history);
    } catch (error) {
      const errorMessageText =
        error instanceof Error ? error.message : 'Terjadi kesalahan.';
      const errorMessage: Message = { from: 'ai', text: errorMessageText };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh komponen UI
  return {
    messages,
    isLoading,
    sendMessage,
  };
}

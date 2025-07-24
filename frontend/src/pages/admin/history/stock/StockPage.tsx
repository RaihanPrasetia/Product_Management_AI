import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { useNotification } from '@/hooks/useNotification';
import { Stock } from '@/utils/types/StockType';
import { stockService } from '@/services/stock/stockService';
import { StockList } from '@/components/admin/stock/StockList';

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await stockService.getAll();
      if (response.success && response.stocks) {
        setStocks(response.stocks);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data kategori';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return (
    <Content>
      <ContentHead
        title="List Stock"
        subTitle="Kelola kategori produk Anda di sini"
      />

      <ContentBody>
        <StockList stocks={stocks} loading={loading} />
      </ContentBody>
    </Content>
  );
}

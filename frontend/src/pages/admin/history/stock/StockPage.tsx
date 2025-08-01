import { useEffect } from 'react';
import Content from '@/components/ui/content/Content';
import CustomeCard from '@/components/ui/content/CustomeCard';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { StockList } from '@/components/admin/stock/StockList';
import { useStockStore } from '@/stores/stock.store';

export default function StockPage() {
  const { fetchData, loading, data } = useStockStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Content>
      <ContentHead
        title="List Stock"
        subTitle="Kelola kategori produk Anda di sini"
      />

      <CustomeCard>
        <StockList stocks={data} loading={loading} />
      </CustomeCard>
    </Content>
  );
}

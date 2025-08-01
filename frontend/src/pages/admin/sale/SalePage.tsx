import Content from '@/components/ui/content/Content';
import CustomeCard from '@/components/ui/content/CustomeCard';
import { ContentHead } from '@/components/ui/content/ContentHead';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SaleList } from '@/components/admin/sale/SaleList';
import { useSaleStore } from '@/stores/sale.store';
import { useEffect } from 'react';

export default function SalePage() {
  const navigate = useNavigate();
  const { fetchData, loading, data } = useSaleStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Content>
      <ContentHead
        title="List Sale"
        subTitle="Kelola penjualan produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/transaction')}
        >
          Add Transaksi
        </Button>
      </ContentHead>
      <CustomeCard>
        <SaleList sales={data} loading={loading} />
      </CustomeCard>
    </Content>
  );
}

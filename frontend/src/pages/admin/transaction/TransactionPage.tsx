// src/pages/TransactionPage.tsx
import { ContentHead } from '@/components/ui/content/ContentHead';
import { Button, Grid } from '@mui/material';
import { CartTable } from '@/components/admin/transaction/CartTable'; // Komponen anak (dibuat di bawah)
import { TransactionSummary } from '@/components/admin/transaction/TransactionSummary'; // Komponen anak
import Content from '@/components/ui/content/Content';
import { useState } from 'react';
import { Product } from '@/types/ProductType';
import { useTransactionStore } from '@/stores/transaction.store';
import { ProductSelectionModal } from '@/components/admin/transaction/ProductSelectionModal';
import PaymentSection from '@/components/admin/transaction/PaymentSection';
import CustomCard from '@/components/ui/content/CustomeCard';

export default function TransactionPage() {
  const { addItem } = useTransactionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (product: Product, variantId: string) => {
    addItem(product, variantId);
    setIsModalOpen(false);
  };
  return (
    <Content>
      <ContentHead title="Transaksi" subTitle="Buat transaksi penjualan baru" />
      <Grid container spacing={3}>
        {/* Kolom Atas: Pencarian Produk & Keranjang */}
        <Grid size={{ xs: 12 }}>
          <CustomCard>
            <div>
              <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
                Cari Produk
              </Button>
            </div>
            <CartTable />
          </CustomCard>
        </Grid>

        {/* Kolom Bawah Kiri: Pembayaran */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomCard>
            <PaymentSection />
          </CustomCard>
        </Grid>

        {/* Kolom Bawah kanan: Ringkasan */}
        <Grid size={{ xs: 12, md: 8 }}>
          <CustomCard>
            {/* <PaymentSection /> */}
            <TransactionSummary />
          </CustomCard>
        </Grid>
      </Grid>

      <ProductSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(product: Product, variantId?: string) =>
          handleSelectProduct(product, variantId || '')
        }
      />
    </Content>
  );
}

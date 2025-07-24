import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { Purchase } from '@/utils/types/PurchaseType';
import { PurchaseList } from '@/components/admin/purchase/PurchaseList';
import { purchaseService } from '@/services/purchase/purchaseService';
import { PurchaseDrawer } from '@/components/admin/purchase/PurchaseDrawer';

export default function PurchasePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await purchaseService.getAll();
      if (response.success && response.purchases) {
        setPurchases(response.purchases);
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
    fetchPurchases();
  }, [fetchPurchases]);

  const handleOpenDrawer = (mode: 'add' | 'edit', purchase?: Purchase) => {
    setEditMode(mode === 'edit');
    setSelectedPurchase(purchase || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPurchase(null);
  };

  return (
    <Content>
      <ContentHead
        title="List Purchase"
        subTitle="Kelola kategori produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer('add')}
        >
          Tambah Purchase
        </Button>
      </ContentHead>
      <ContentBody>
        <PurchaseList
          purchases={purchases}
          loading={loading}
          onEdit={(purchase) => handleOpenDrawer('edit', purchase)}
        />
      </ContentBody>

      <PurchaseDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        purchase={selectedPurchase}
        onSuccess={() => {
          handleCloseDrawer();
          fetchPurchases(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

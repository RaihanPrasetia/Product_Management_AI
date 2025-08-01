import { useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import CustomeCard from '@/components/ui/content/CustomeCard';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Purchase } from '@/types/PurchaseType';
import { PurchaseList } from '@/components/admin/purchase/PurchaseList';
import { PurchaseDrawer } from '@/components/admin/purchase/PurchaseDrawer';
import { usePurchaseStore } from '@/stores/purchase.store';

export default function PurchasePage() {
  const { fetchData, data, loading } = usePurchaseStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <CustomeCard>
        <PurchaseList
          purchases={data}
          loading={loading}
          onEdit={(purchase) => handleOpenDrawer('edit', purchase)}
        />
      </CustomeCard>

      <PurchaseDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        purchase={selectedPurchase}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

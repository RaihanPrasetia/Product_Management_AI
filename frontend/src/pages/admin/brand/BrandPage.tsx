import { useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import CustomeCard from '@/components/ui/content/CustomeCard';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Brand } from '@/types/BrandType';
import { BrandList } from '@/components/admin/brand/BrandList';
import { BrandDrawer } from '@/components/admin/brand/BrandDrawer';
import { useBrandStore } from '@/stores/brand.store';

export default function BrandPage() {
  const { fetchData, loading, data } = useBrandStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDrawer = (mode: 'add' | 'edit', brand?: Brand) => {
    setEditMode(mode === 'edit');
    setSelectedBrand(brand || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBrand(null);
  };

  return (
    <Content>
      <ContentHead
        title="List Brand"
        subTitle="Kelola kategori produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer('add')}
        >
          Tambah Brand
        </Button>
      </ContentHead>
      <CustomeCard>
        <BrandList
          brands={data}
          loading={loading}
          onEdit={(brand) => handleOpenDrawer('edit', brand)}
        />
      </CustomeCard>

      <BrandDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        brand={selectedBrand}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

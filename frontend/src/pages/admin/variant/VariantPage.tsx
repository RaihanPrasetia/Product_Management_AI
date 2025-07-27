import { useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Variant } from '@/types/VariantType';
import { VariantList } from '@/components/admin/variant/VariantList';
import { VariantDrawer } from '@/components/admin/variant/VariantDrawer';
import { useVariantStore } from '@/stores/variant.store';

export default function VariantPage() {
  const { data, fetchData, loading } = useVariantStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDrawer = (mode: 'add' | 'edit', variant?: Variant) => {
    setEditMode(mode === 'edit');
    setSelectedVariant(variant || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedVariant(null);
  };

  return (
    <Content>
      <ContentHead
        title="List Variant"
        subTitle="Kelola kategori produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer('add')}
        >
          Tambah Variant
        </Button>
      </ContentHead>
      <ContentBody>
        <VariantList
          variants={data}
          loading={loading}
          onEdit={(variant) => handleOpenDrawer('edit', variant)}
        />
      </ContentBody>

      <VariantDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        variant={selectedVariant}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

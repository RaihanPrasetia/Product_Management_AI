import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { Variant } from '@/utils/types/VariantType';
import { variantService } from '@/services/variant/variantService';
import { VariantList } from '@/components/admin/variant/VariantList';
import { VariantDrawer } from '@/components/admin/variant/VariantDrawer';

export default function VariantPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchVariants = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await variantService.getAll();
      if (response.success && response.variants) {
        setVariants(response.variants);
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
    fetchVariants();
  }, [fetchVariants]);

  const handleOpenDrawer = (mode: 'add' | 'edit', variant?: Variant) => {
    setEditMode(mode === 'edit');
    setSelectedVariant(variant || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedVariant(null);
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await variantService.delete(id);
      showNotification('Variant berhasil dihapus', 'success');
      fetchVariants(); // Refresh data setelah berhasil
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Gagal menghapus kategori',
        'error'
      );
    }
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
          variants={variants}
          loading={loading}
          onEdit={(variant) => handleOpenDrawer('edit', variant)}
          onDelete={handleDeleteVariant}
        />
      </ContentBody>

      <VariantDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        variant={selectedVariant}
        onSuccess={() => {
          handleCloseDrawer();
          fetchVariants(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

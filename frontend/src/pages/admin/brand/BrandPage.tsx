import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { Brand } from '@/utils/types/BrandType';
import { brandService } from '@/services/brand/brandService';
import { BrandList } from '@/components/admin/brand/BrandList';
import { BrandDrawer } from '@/components/admin/brand/BrandDrawer';

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await brandService.getAll();
      if (response.success && response.brands) {
        setBrands(response.brands);
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
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenDrawer = (mode: 'add' | 'edit', brand?: Brand) => {
    setEditMode(mode === 'edit');
    setSelectedBrand(brand || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBrand(null);
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await brandService.delete(id);
      showNotification('Brand berhasil dihapus', 'success');
      fetchBrands(); // Refresh data setelah berhasil
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
      <ContentBody>
        <BrandList
          brands={brands}
          loading={loading}
          onEdit={(brand) => handleOpenDrawer('edit', brand)}
          onDelete={handleDeleteBrand}
        />
      </ContentBody>

      <BrandDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        brand={selectedBrand}
        onSuccess={() => {
          handleCloseDrawer();
          fetchBrands(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

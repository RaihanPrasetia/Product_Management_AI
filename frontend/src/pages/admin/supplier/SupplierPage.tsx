import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { Supplier } from '@/utils/types/SupplierType';
import { supplierService } from '@/services/supplier/supplierService';
import { SupplierList } from '@/components/admin/supplier/SupplierList';
import { SupplierDrawer } from '@/components/admin/supplier/SupplierDrawer';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await supplierService.getAll();
      if (response.success && response.suppliers) {
        setSuppliers(response.suppliers);
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
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleOpenDrawer = (mode: 'add' | 'edit', supplier?: Supplier) => {
    setEditMode(mode === 'edit');
    setSelectedSupplier(supplier || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await supplierService.delete(id);
      showNotification('Supplier berhasil dihapus', 'success');
      fetchSuppliers(); // Refresh data setelah berhasil
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
        title="List Supplier"
        subTitle="Kelola kategori produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer('add')}
        >
          Tambah Supplier
        </Button>
      </ContentHead>
      <ContentBody>
        <SupplierList
          suppliers={suppliers}
          loading={loading}
          onEdit={(supplier) => handleOpenDrawer('edit', supplier)}
          onDelete={handleDeleteSupplier}
        />
      </ContentBody>

      <SupplierDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        supplier={selectedSupplier}
        onSuccess={() => {
          handleCloseDrawer();
          fetchSuppliers(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

import { useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Supplier } from '@/types/SupplierType';
import { SupplierList } from '@/components/admin/supplier/SupplierList';
import { SupplierDrawer } from '@/components/admin/supplier/SupplierDrawer';
import { useSupplierStore } from '@/stores/supplier.store';

export default function SupplierPage() {
  const { fetchData, data, loading } = useSupplierStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDrawer = (mode: 'add' | 'edit', supplier?: Supplier) => {
    setEditMode(mode === 'edit');
    setSelectedSupplier(supplier || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedSupplier(null);
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
          suppliers={data}
          loading={loading}
          onEdit={(supplier) => handleOpenDrawer('edit', supplier)}
        />
      </ContentBody>

      <SupplierDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        supplier={selectedSupplier}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

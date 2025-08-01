import { useEffect, useState } from 'react';
import CustomeCard from '@/components/ui/content/CustomeCard';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { ProductList } from '@/components/admin/products/ProductList';
import { ProductDrawer } from '@/components/admin/products/ProductDrawer';
import { ImportExport } from '@mui/icons-material';
import { Product } from '@/types/ProductType';
import { productService } from '@/services/productService';
import { useProductStore } from '@/stores/product.store';

export default function ProductPage() {
  const { fetchData, data, loading } = useProductStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { showNotification } = useNotification(); // Use the notification hook

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDrawer = (mode: 'add' | 'edit', product?: Product) => {
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setEditMode(true);
    } else {
      setSelectedProduct(null);
      setEditMode(false);
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleImportProduct = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        await productService.import(formData); // Buat di langkah 2
        showNotification('Import produk berhasil', 'success');
        fetchData();
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : 'Gagal import produk',
          'error'
        );
      }
    };

    input.click();
  };

  return (
    <>
      <ContentHead title="List Product" subTitle="Manage your product here">
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ImportExport />}
            onClick={() => handleImportProduct()}
          >
            Import
          </Button>
          <Button
            className="bg-utama"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDrawer('add')}
          >
            Add Product
          </Button>
        </Box>
      </ContentHead>
      <CustomeCard>
        <ProductList
          products={data}
          loading={loading}
          onEdit={(product) => handleOpenDrawer('edit', product)}
        />
      </CustomeCard>

      <ProductDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        product={selectedProduct}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData();
        }}
      />
    </>
  );
}

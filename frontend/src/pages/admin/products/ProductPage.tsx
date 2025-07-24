import { useCallback, useEffect, useState } from 'react';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotification } from '@/hooks/useNotification';
import { ProductList } from '@/components/admin/products/ProductList';
import { ProductDrawer } from '@/components/admin/products/ProductDrawer';
import { ImportExport } from '@mui/icons-material';
import { Product, ProductFilter } from '@/utils/types/ProductType';
import { productService } from '@/services/product/productService';

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { showNotification } = useNotification(); // Use the notification hook
  const [filter, setFilter] = useState<ProductFilter>('active');
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      let options = {};
      if (filter === 'all') {
        options = { includeDeleted: true };
      } else {
        options = { includeDeleted: false };
      }

      const response = await productService.getAll(options);
      setProducts(response.products);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to fetch products';
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, showNotification]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      showNotification('Produk berhasil dihapus', 'success');
      fetchProducts();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Failed to delete product',
        'error'
      );
    }
  };
  const handleRestore = async (id: string) => {
    try {
      await productService.restore(id);
      showNotification('Produk berhasil pulihkan', 'success');
      fetchProducts();
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Failed to delete product',
        'error'
      );
    }
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
        fetchProducts();
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
      <ContentBody>
        <ProductList
          products={products}
          loading={loading}
          onEdit={(product) => handleOpenDrawer('edit', product)}
          onDelete={handleDeleteProduct}
          onRestore={handleRestore}
          filter={filter}
          setFilter={setFilter}
        />
      </ContentBody>

      <ProductDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        product={selectedProduct}
        onSuccess={() => {
          handleCloseDrawer();
          fetchProducts();
        }}
      />
    </>
  );
}

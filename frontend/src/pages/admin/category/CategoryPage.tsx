import { useCallback, useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CategoryList } from '@/components/admin/category/CategoryList';
import { CategoryDrawer } from '@/components/admin/category/CategoryDrawer';
import { useNotification } from '@/hooks/useNotification';
import { Category } from '@/utils/types/CategoryType';
import { categoryService } from '@/services/category/categoryService';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { showNotification } = useNotification();

  // Fungsi untuk mengambil kategori (aktif/non-aktif)
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Panggil service tanpa parameter untuk mendapatkan data default
      const response = await categoryService.getAll();
      if (response.success && response.categories) {
        setCategories(response.categories);
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
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenDrawer = (mode: 'add' | 'edit', category?: Category) => {
    setEditMode(mode === 'edit');
    setSelectedCategory(category || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      showNotification('Kategori berhasil dihapus', 'success');
      fetchCategories(); // Refresh data setelah berhasil
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
        title="List Kategori"
        subTitle="Kelola kategori produk Anda di sini"
      >
        <Button
          className="bg-utama"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDrawer('add')}
        >
          Tambah Kategori
        </Button>
      </ContentHead>
      <ContentBody>
        <CategoryList
          categories={categories}
          loading={loading}
          onEdit={(category) => handleOpenDrawer('edit', category)}
          onDelete={handleDeleteCategory}
        />
      </ContentBody>

      <CategoryDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        category={selectedCategory}
        onSuccess={() => {
          handleCloseDrawer();
          fetchCategories(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

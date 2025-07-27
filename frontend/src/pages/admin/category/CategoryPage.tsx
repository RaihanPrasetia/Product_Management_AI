import { useEffect, useState } from 'react';
import Content from '@/components/ui/content/Content';
import ContentBody from '@/components/ui/content/ContentBody';
import { ContentHead } from '@/components/ui/content/ContentHead';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CategoryList } from '@/components/admin/category/CategoryList';
import { CategoryDrawer } from '@/components/admin/category/CategoryDrawer';
import { Category } from '@/types/CategoryType';
import { useCategoryStore } from '@/stores/category.store';

export default function CategoryPage() {
  const { fetchData, data, loading } = useCategoryStore();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDrawer = (mode: 'add' | 'edit', category?: Category) => {
    setEditMode(mode === 'edit');
    setSelectedCategory(category || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
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
          categories={data}
          loading={loading}
          onEdit={(category) => handleOpenDrawer('edit', category)}
        />
      </ContentBody>

      <CategoryDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editMode={editMode}
        category={selectedCategory}
        onSuccess={() => {
          handleCloseDrawer();
          fetchData(); // Refresh data setelah add/edit
        }}
      />
    </Content>
  );
}

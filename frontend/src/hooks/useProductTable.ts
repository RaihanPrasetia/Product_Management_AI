import { useState, useMemo } from 'react';
import { Product } from '@/utils/types/ProductType';

export const useProductTable = (
  initialProducts: Product[],
  onDelete: (id: string) => void
) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama setelah search
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Gunakan useMemo untuk performa, agar tidak memfilter ulang di setiap render
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product) => {
        // Hitung total stok untuk setiap produk
        const totalStock =
          product.type === 'SIMPLE'
            ? product.stock?.quantity ?? 0
            : product.productVariants.reduce(
                (sum, variant) => sum + (variant.stock?.quantity ?? 0),
                0
              );
        return { ...product, totalStock };
      });
  }, [initialProducts, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredProducts, currentPage, rowsPerPage]);

  return {
    currentPage,
    rowsPerPage,
    searchTerm,
    deleteDialogOpen,
    productToDelete,
    totalPages,
    paginatedProducts,
    handleSearchChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleRowsPerPageChange,
  };
};

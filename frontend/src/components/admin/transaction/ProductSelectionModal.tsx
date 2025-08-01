import { Modal, Box, Typography, IconButton } from '@mui/material';
import { ProductList } from '../products/ProductList';
import { useProductStore } from '@/stores/product.store';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { Product } from '@/types/ProductType';

interface ProductSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '50%' },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '85vh',
  overflowY: 'auto',
};

export const ProductSelectionModal = ({
  open,
  onClose,
  onSelect,
}: ProductSelectionModalProps) => {
  const { data: products, loading, fetchData } = useProductStore();

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography variant="h6">Pilih Produk</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ProductList
          products={products}
          loading={loading}
          onEdit={() => {}} // Tidak digunakan di mode select
          mode="select"
          onSelect={onSelect}
        />
      </Box>
    </Modal>
  );
};

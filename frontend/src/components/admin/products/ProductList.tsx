import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '../../ui/ConfirmationDialog';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/CustomePagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { formatCurrency } from '@/utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/ProductType';
import {formattedDate} from '@/utils/formattedDate';
import { Restore } from '@mui/icons-material';
import { useProductStore } from '@/stores/product.store';
import { useState } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;

  mode?: 'manage' | 'select'; // Mode default adalah 'manage'
  onSelect?: (product: Product, variantId?: string) => void;
}

export const ProductList = ({
  products,
  loading,
  onEdit,
  mode = 'manage', // Set default mode
  onSelect,
}: ProductListProps) => {
  const navigate = useNavigate();

  const {
    pagination,
    restoreProduct,
    filters,
    setSort,
    deleteProduct,
    setFilter,
  } = useProductStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);
  const { showNotification } = useNotification();

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleSelectClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    if (product.type === 'SIMPLE') {
      onSelect && onSelect(product);
    } else {
      // Jika VARIABLE, buka popover
      setAnchorEl(event.currentTarget);
      setSelectedProductForVariant(product);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedProductForVariant(null);
  };

  const handleVariantSelect = (variantId: string) => {
    if (selectedProductForVariant) {
      onSelect && onSelect(selectedProductForVariant, variantId);
    }
    handleClosePopover();
  };

  const isPopoverOpen = Boolean(anchorEl);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, showNotification);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    await restoreProduct(id, showNotification);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleToDetail = (id: string) => {
    navigate(`/product/detail?productId=${id}`);
  };

  if (loading) {
    return (
      <Box className="w-full h-[60vh] flex flex-col justify-center items-center gap-4">
        <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        <p className="text-utama text-lg">Loading...</p>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <CustomeFilter filters={filters} setFilter={setFilter} />
        <TableContainer>
          <Table aria-label="product table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <SortableHeaderCell
                  sortKey="name"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Name
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="sku"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  SKU
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="type"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Type
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="price"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Price
                </SortableHeaderCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                {mode === 'manage' && <TableCell>Tanggal Dihapus</TableCell>}
                <TableCell>
                  <Typography className="text-right">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-utama-hover cursor-pointer"
                      onClick={() => handleToDetail(product.id)}
                    >
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell width={'100px'}>
                    <Chip
                      label={product.type}
                      size="small"
                      sx={{
                        backgroundColor:
                          product.type === 'SIMPLE' ? '#34d4c1' : '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                  <TableCell>
                    {product.type === 'SIMPLE'
                      ? product.stock?.quantity ?? 0
                      : product.productVariants.reduce(
                          (sum, variant) =>
                            sum + (variant.stock?.quantity ?? 0),
                          0
                        )}
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  {mode === 'manage' && (
                    <TableCell>
                      {product.deletedAt
                        ? formattedDate(product.deletedAt)
                        : '-'}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {mode === 'select' ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => handleSelectClick(e, product)}
                      >
                        Pilih
                      </Button>
                    ) : product.deletedAt ? (
                      <Tooltip title="Restore">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRestore(product.id)}
                        >
                          <Restore />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="w-full flex justify-end items-center py-4 gap-2">
          <Pagination pagination={pagination} setFilter={setFilter} />
        </Box>
      </Box>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Product"
        content={`Are you sure you want to delete "${productToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List dense>
          {selectedProductForVariant?.productVariants.map((variant) => (
            <ListItem key={variant.id} disablePadding>
              <ListItemButton onClick={() => handleVariantSelect(variant.id)}>
                <ListItemText
                  primary={variant.value}
                  secondary={`Stok: ${variant.stock?.quantity ?? 0}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

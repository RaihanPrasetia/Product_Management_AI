// src/pages/admin/ProductDetail.tsx

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  Skeleton,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { formatToRupiah } from '@/utils/priceFormated';
import Content from '@/components/ui/content/Content';
import { ContentHead } from '@/components/ui/content/ContentHead';
import { Delete } from '@mui/icons-material';
import { MdArrowBack } from 'react-icons/md';
import { Product, ProductVariant } from '@/utils/types/ProductType';
import formattedDate from '@/utils/formattedDate';
import { productService } from '@/services/product/productService';

// Sub-komponen untuk menampilkan informasi utama produk
const ProductInfo = ({ product }: { product: Product }) => {
  const totalStock = useMemo(() => {
    return product.type === 'SIMPLE'
      ? product.stock?.quantity ?? 0
      : product.productVariants.reduce(
          (sum, v) => sum + (v.stock?.quantity ?? 0),
          0
        );
  }, [product]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Chip
            label={product.type}
            color={product.type === 'SIMPLE' ? 'info' : 'warning'}
            sx={{ fontWeight: 'bold', alignSelf: 'flex-start' }}
          />
          <Typography variant="h5" component="div" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description || 'Tidak ada deskripsi.'}
          </Typography>
          <Divider />
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatToRupiah(Number(product.price))}
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Kategori
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {product.category.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Brand
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {product.brand.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Stok
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {totalStock} unit
              </Typography>
            </Box>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ pt: 2 }}>
            Dibuat pada: {formattedDate(product.createdAt)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Sub-komponen untuk menampilkan tabel varian
const ProductVariantsInfo = ({ variants }: { variants: ProductVariant[] }) => (
  <Card sx={{ marginTop: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Varian Produk
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Varian</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell align="right">Stok</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {variant.variant.name}:
                  </Typography>
                  <Typography variant="body2">{variant.value}</Typography>
                </TableCell>
                <TableCell>{variant.sku}</TableCell>
                <TableCell>{formatToRupiah(Number(variant.price))}</TableCell>
                <TableCell align="right">
                  {variant.stock?.quantity ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

// Skeleton Loader untuk UX yang lebih baik
const ProductDetailSkeleton = () => (
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Skeleton variant="rectangular" height={300} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width="20%" height={40} />
        <Skeleton variant="text" width="80%" height={50} />
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="text" width="40%" height={40} />
      </Stack>
    </Grid>
  </Grid>
);

// Komponen Utama
export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      showNotification('ID Produk tidak valid', 'error');
      navigate('/product');
      return;
    }

    try {
      setLoading(true);
      const response = await productService.getById(productId); // <-- Diperbaiki
      setProduct(response.product); // <-- Diperbaiki
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Gagal mengambil data produk';
      showNotification(errorMessage, 'error');
      navigate('/product');
    } finally {
      setLoading(false);
    }
  }, [productId, showNotification, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleDeleteProduct = async () => {
    // Implementasi dialog konfirmasi di sini sangat disarankan
    try {
      if (productId) {
        await productService.delete(productId);
        showNotification('Produk berhasil dihapus', 'success');
        navigate('/product');
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Gagal menghapus produk',
        'error'
      );
    }
  };

  return (
    <Content>
      <ContentHead
        title="Detail Produk"
        subTitle="Informasi lengkap mengenai produk"
      >
        <Stack direction="row" spacing={2}>
          <button
            className="flex items-center px-4 border-2 border-slate-500 py-2 text-sm font-semibold text-slate-500 rounded-md transition hover:bg-slate-200"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack className="h-5 w-5 mr-1" /> Back
          </button>
          <button
            className="flex items-center px-4 py-2 text-sm font-semibold text-white rounded-md transition bg-red-600 hover:bg-red-700"
            onClick={handleDeleteProduct}
          >
            <Delete className="h-5 w-5 mr-1" /> Delete
          </button>
        </Stack>
      </ContentHead>

      {loading ? (
        <ProductDetailSkeleton />
      ) : product ? (
        <Grid container spacing={3}>
          {/* Kolom Kiri - Informasi Utama */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ProductInfo product={product} />
          </Grid>

          {/* Kolom Kanan - Varian & Gambar (jika ada) */}
          <Grid size={{ xs: 12, md: 5 }}>
            {product.type === 'VARIABLE' &&
              product.productVariants.length > 0 && (
                <ProductVariantsInfo variants={product.productVariants} />
              )}
            {/* Anda bisa menambahkan komponen untuk gambar di sini jika skema diupdate */}
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Produk tidak ditemukan.</Typography>
      )}
    </Content>
  );
}

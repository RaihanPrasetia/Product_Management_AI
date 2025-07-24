import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { formatToRupiah } from '@/utils/priceFormated';
import Content from '@/components/ui/content/Content';
import { ContentHead } from '@/components/ui/content/ContentHead';
import { MdArrowBack } from 'react-icons/md';
import { Purchase, PurchaseItem } from '@/utils/types/PurchaseType';
import { purchaseService } from '@/services/purchase/purchaseService';
import formattedDate from '@/utils/formattedDate';

// Helper untuk menampilkan detail item di dalam tabel
const getItemDetails = (item: PurchaseItem) => {
  if (item.product) {
    return { name: item.product.name, sku: item.product.sku };
  }
  if (item.productVariant) {
    return {
      name: `${item.productVariant.product.name} (${item.productVariant.value})`,
      sku: item.productVariant.sku,
    };
  }
  return { name: 'N/A', sku: 'N/A' };
};

// Sub-komponen untuk menampilkan info supplier dan pembelian
const PurchaseInfoCard = ({ purchase }: { purchase: Purchase }) => (
  <Card variant="outlined">
    <CardContent>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            SUPPLIER
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {purchase.supplier.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {purchase.supplier.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {purchase.supplier.address}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            TENTANG PEMBELIAN
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            Invoice: {purchase.invoiceNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tanggal: {formattedDate(purchase.purchaseDate)}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Sub-komponen untuk menampilkan tabel item
const PurchaseItemsTable = ({ items }: { items: PurchaseItem[] }) => (
  <TableContainer component={Card} variant="outlined" sx={{ mt: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Deskripsi Item</TableCell>
          <TableCell align="right">Kuantitas</TableCell>
          <TableCell align="right">Harga Satuan</TableCell>
          <TableCell align="right">Subtotal</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          const details = getItemDetails(item);
          return (
            <TableRow key={item.id}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {details.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SKU: {details.sku}
                </Typography>
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">
                {formatToRupiah(Number(item.price))}
              </TableCell>
              <TableCell align="right">
                {formatToRupiah(Number(item.subtotal))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

// Sub-komponen untuk Skeleton Loader
const PurchaseDetailSkeleton = () => (
  <Stack spacing={3}>
    <Skeleton variant="rectangular" height={120} />
    <Skeleton variant="rectangular" height={200} />
  </Stack>
);

// Komponen Utama
export default function PurchaseDetailPage() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const purchaseId = searchParams.get('purchaseId');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchPurchase = useCallback(async () => {
    if (!purchaseId) {
      showNotification('ID Pembelian tidak valid', 'error');
      navigate('/admin/purchase');
      return;
    }

    try {
      setLoading(true);
      const response = await purchaseService.getById(purchaseId);
      if (response.purchase) {
        setPurchase(response.purchase);
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data pembelian';
      showNotification(msg, 'error');
      navigate('/admin/purchase');
    } finally {
      setLoading(false);
    }
  }, [purchaseId, showNotification, navigate]);

  useEffect(() => {
    fetchPurchase();
  }, [fetchPurchase]);

  return (
    <Content>
      <ContentHead
        title="Detail Pembelian"
        subTitle={purchase ? `Invoice: ${purchase.invoiceNumber}` : ''}
      >
        <button
          className="flex items-center px-4 border-2 border-slate-500 py-2 text-sm font-semibold text-slate-500 rounded-md transition hover:bg-slate-200"
          onClick={() => navigate(-1)}
        >
          <MdArrowBack className="h-5 w-5 mr-1" />
          Kembali
        </button>
      </ContentHead>

      <Box sx={{ mt: 3 }}>
        {loading ? (
          <PurchaseDetailSkeleton />
        ) : purchase ? (
          <>
            <PurchaseInfoCard purchase={purchase} />
            <PurchaseItemsTable items={purchase.items} />

            <Stack alignItems="flex-end" sx={{ mt: 3, pr: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Total Pembayaran
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatToRupiah(Number(purchase.totalAmount))}
              </Typography>
            </Stack>
          </>
        ) : (
          <Typography>Data pembelian tidak ditemukan.</Typography>
        )}
      </Box>
    </Content>
  );
}

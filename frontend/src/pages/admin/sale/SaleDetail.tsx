// src/pages/admin/sale/SaleDetail.tsx

import Content from '@/components/ui/content/Content';
import { ContentHead } from '@/components/ui/content/ContentHead';
import CustomCard from '@/components/ui/content/CustomeCard';
import { useNotification } from '@/hooks/useNotification';
import { saleService } from '@/services/saleService';
import { Sale, SaleItem } from '@/types/SaleType';
import { formatCurrency } from '@/utils/formatCurrency';
import { formattedDate } from '@/utils/formattedDate';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Komponen untuk menampilkan informasi dasar penjualan
const SaleInfoCard = ({ sale }: { sale: Sale }) => (
  <CustomCard>
    <Stack spacing={2}>
      <Typography variant="h6">Rincian Transaksi</Typography>
      <Divider />
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Invoice
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {sale.invoiceNumber}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tanggal
          </Typography>
          <Typography variant="body1">
            {formattedDate(sale.saleDate)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={sale.deletedAt ? 'Dihapus' : 'Selesai'}
            color={sale.deletedAt ? 'error' : 'success'}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="text.secondary">
            Catatan
          </Typography>
          <Typography variant="body1">{sale.notes || '-'}</Typography>
        </Grid>
      </Grid>
    </Stack>
  </CustomCard>
);

// Komponen untuk menampilkan rincian pembayaran
const PaymentDetailsCard = ({ sale }: { sale: Sale }) => {
  const totalPaid = sale.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const change = totalPaid - Number(sale.totalAmount);

  return (
    <CustomCard>
      <Stack spacing={1.5}>
        <Typography variant="h6">Ringkasan Keuangan</Typography>
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Subtotal</Typography>
          <Typography variant="body2">
            {formatCurrency(Number(sale.subtotal))}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Diskon</Typography>
          <Typography variant="body2" color="error.main">
            -{formatCurrency(Number(sale.totalDiscount))}
          </Typography>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1" fontWeight="bold">
            Total Tagihan
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(Number(sale.totalAmount))}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        {sale.payments.map((payment) => (
          <Box key={payment.id} display="flex" justifyContent="space-between">
            <Typography variant="body2">
              Pembayaran ({payment.paymentMethod})
            </Typography>
            <Typography variant="body2">
              {formatCurrency(Number(payment.amount))}
            </Typography>
          </Box>
        ))}
        <Divider />
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ color: 'success.main' }}
        >
          <Typography variant="body1" fontWeight="bold">
            Total Dibayar
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(totalPaid)}
          </Typography>
        </Box>
        {change > 0 && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Kembalian</Typography>
            <Typography variant="body2">{formatCurrency(change)}</Typography>
          </Box>
        )}
      </Stack>
    </CustomCard>
  );
};

// Komponen untuk menampilkan tabel item yang dibeli
const SaleItemsTable = ({ items }: { items: SaleItem[] }) => (
  <CustomCard>
    <Typography variant="h6" gutterBottom>
      Daftar Item
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Nama Produk</TableCell>
            <TableCell align="right">Kuantitas</TableCell>
            <TableCell align="right">Harga</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {/* Asumsi Anda menyertakan relasi product pada query API */}
                {item.product?.name || 'Nama Produk Tidak Tersedia'}
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">
                {formatCurrency(Number(item.price))}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(Number(item.subtotal))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </CustomCard>
);

export default function SaleDetail() {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const saleId = searchParams.get('saleId');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchSale = useCallback(async () => {
    if (!saleId) {
      showNotification('ID Penjualan tidak valid', 'error');
      navigate('/sale');
      return;
    }
    try {
      setLoading(true);
      const response = await saleService.getById(saleId);
      setSale(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data penjualan';
      showNotification(errorMessage, 'error');
      navigate('/sale');
    } finally {
      setLoading(false);
    }
  }, [saleId, showNotification, navigate]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  if (loading) {
    return (
      <Content>
        <Box className="flex justify-center items-center h-96">
          <FaSpinner className="animate-spin text-4xl text-gray-500" />
        </Box>
      </Content>
    );
  }

  if (!sale) {
    return (
      <Content>
        <ContentHead title="Rincian Penjualan Tidak Ditemukan" />
        <Typography>
          Data penjualan tidak dapat ditemukan atau ID tidak valid.
        </Typography>
      </Content>
    );
  }

  return (
    <Content>
      <ContentHead
        title="Rincian Penjualan"
        subTitle={`Invoice: ${sale.invoiceNumber}`}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SaleInfoCard sale={sale} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PaymentDetailsCard sale={sale} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SaleItemsTable items={sale.items} />
        </Grid>
      </Grid>
    </Content>
  );
}

// src/components/admin/transaction/TransactionSummary.tsx

import { useTransactionStore } from '@/stores/transaction.store';
import { useShallow } from 'zustand/react/shallow';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNotification } from '@/hooks/useNotification';
import { formatCurrency } from '@/utils/formatCurrency';

export function TransactionSummary() {
  const { showNotification } = useNotification();
  const summaryData = useTransactionStore(
    useShallow((state) => {
      // Kalkulasi tetap di sini, ini sudah benar
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const totalDiscount = state.items.reduce(
        (sum, item) => sum + (item.discount || 0),
        0
      );
      const totalAmount = subtotal - totalDiscount;
      const totalPaid = state.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const amountDue = totalAmount - totalPaid;

      return {
        subtotal,
        totalDiscount,
        totalAmount,
        totalPaid,
        amountDue,
        notes: state.notes,
        status: state.status,
        setNotes: state.setNotes,
        submitTransaction: state.submitTransaction,
      };
    })
  );

  // Destructure untuk kemudahan penggunaan di JSX
  const {
    subtotal,
    totalDiscount,
    totalAmount,
    totalPaid,
    amountDue,
    notes,
    status,
    setNotes,
    submitTransaction,
  } = summaryData;

  const isLoading = status === 'loading';

  const handleSubmit = () => {
    // Panggil action dari store
    submitTransaction(showNotification);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" component="h3">
        Ringkasan Transaksi
      </Typography>

      {/* Rincian Perhitungan */}
      <Stack spacing={1.5}>
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        <SummaryRow
          label="Diskon"
          value={`- ${formatCurrency(totalDiscount)}`}
        />
        <Divider />
        <SummaryRow
          label="Total Tagihan"
          value={formatCurrency(totalAmount)}
          isTotal
        />
        <SummaryRow label="Total Dibayar" value={formatCurrency(totalPaid)} />
        <SummaryRow
          label={amountDue >= 0 ? 'Sisa Tagihan' : 'Kembalian'}
          value={formatCurrency(Math.abs(amountDue))}
          isTotal
          color={amountDue > 0 ? 'error.main' : 'success.main'}
        />
      </Stack>

      <Divider />

      {/* Kolom Catatan */}
      <TextField
        label="Catatan Transaksi (Opsional)"
        multiline
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        variant="outlined"
        fullWidth
        disabled={isLoading}
      />

      {/* Tombol Aksi */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        disabled={isLoading || amountDue > 0 || totalAmount === 0}
      >
        {isLoading ? 'Memproses...' : 'Selesaikan Transaksi'}
      </Button>
    </Stack>
  );
}

// Komponen kecil untuk baris ringkasan
const SummaryRow = ({
  label,
  value,
  isTotal = false,
  color,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
  color?: string;
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography
      variant={isTotal ? 'subtitle1' : 'body2'}
      fontWeight={isTotal ? 'bold' : 'normal'}
    >
      {label}
    </Typography>
    <Typography
      variant={isTotal ? 'subtitle1' : 'body2'}
      fontWeight={isTotal ? 'bold' : 'normal'}
      color={color}
    >
      {value}
    </Typography>
  </Box>
);

// src/components/admin/transaction/PaymentSection.tsx

import { useState } from 'react';
import { useTransactionStore } from '@/stores/transaction.store';
import { PaymentMethod, PaymentRequest } from '@/types/SaleType';
import { useShallow } from 'zustand/react/shallow';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AddCard as AddCardIcon,
} from '@mui/icons-material';
import { formatCurrency } from '@/utils/formatCurrency';

export default function PaymentSection() {
  // 1. Hubungkan ke Zustand Store
  const { payments, addPayment, removePayment, amountDue } =
    useTransactionStore(
      useShallow((state) => {
        // Lakukan kalkulasi untuk mendapatkan sisa tagihan
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
          payments: state.payments,
          addPayment: state.addPayment,
          removePayment: state.removePayment,
          amountDue,
        };
      })
    );

  // 2. State lokal untuk form input pembayaran
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [error, setError] = useState('');

  // 3. Handler untuk menambahkan pembayaran
  const handleAddPayment = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    const newPayment: PaymentRequest = {
      amount: numericAmount,
      paymentMethod: method,
    };

    addPayment(newPayment);
    // Reset form setelah ditambahkan
    setAmount('');
    setError('');
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h3">
        Metode Pembayaran
      </Typography>

      {/* Tombol Praktis */}
      <Button
        variant="contained"
        onClick={() => setAmount(String(Math.max(0, amountDue)))}
        disabled={amountDue <= 0}
      >
        Bayar Lunas (Sisa Tagihan)
      </Button>

      {/* Form Input Pembayaran */}
      <Stack spacing={2} direction="row">
        <TextField
          label="Jumlah"
          type="number"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Metode</InputLabel>
          <Select
            value={method}
            label="Metode"
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          >
            {Object.values(PaymentMethod).map((methodName) => (
              <MenuItem key={methodName} value={methodName}>
                {methodName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Button
        variant="outlined"
        startIcon={<AddCardIcon />}
        onClick={handleAddPayment}
      >
        Tambah Pembayaran
      </Button>

      {/* Daftar Pembayaran yang Sudah Ditambahkan */}
      {payments.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Pembayaran Ditambahkan:
          </Typography>
          <List dense>
            {payments.map((p, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removePayment(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={formatCurrency(p.amount)}
                  secondary={p.paymentMethod}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  );
}

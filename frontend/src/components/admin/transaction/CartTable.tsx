// src/components/admin/transaction/CartTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
} from '@mui/material';
import { useTransactionStore } from '@/stores/transaction.store';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency } from '@/utils/formatCurrency';

export const CartTable = () => {
  const { items, removeItem, updateItemQuantity } = useTransactionStore();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Produk</TableCell>
          <TableCell align="right">Harga</TableCell>
          <TableCell align="right">Qty</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell align="center">Aksi</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} align="center">
              Keranjang kosong
            </TableCell>
          </TableRow>
        )}
        {items.map((item) => (
          <TableRow key={item.itemId}>
            <TableCell>
              <span className="text-gray-800 font-bold">
                {item.productName}
                {item.variantName && ` (${item.variantName})`}
              </span>
              <p>Stock: {item.stock}</p>
            </TableCell>
            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
            <TableCell align="right">
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value, 10) || 1;
                  // Validasi agar tidak melebihi stok
                  if (newQty <= item.stock) {
                    updateItemQuantity(item.itemId, newQty);
                  }
                }}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: item.stock,
                    style: { textAlign: 'right' },
                  },
                }}
                sx={{ width: '70px' }}
                size="small"
              />
            </TableCell>
            <TableCell align="right">
              {formatCurrency(item.price * item.quantity)}
            </TableCell>
            <TableCell align="center">
              <IconButton
                onClick={() => removeItem(item.itemId)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

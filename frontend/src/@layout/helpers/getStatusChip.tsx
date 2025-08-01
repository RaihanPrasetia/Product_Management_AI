import { Chip } from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Error,
  Check,
} from '@mui/icons-material';

/**
 * Menghasilkan komponen Chip berdasarkan status yang diberikan.
 * Menerima status berupa string ('pending', 'paid', 'failed') atau boolean.
 * @param status Status transaksi atau entitas.
 */
export const getStatusChip = (status: string | boolean) => {
  let label: string;
  let icon: React.ReactElement;
  let bgcolor: string; // <-- 1. Tambahkan variabel untuk warna latar
  let textColor: string = '#ffffff'; // Warna teks default

  // Cek jika status adalah boolean
  if (typeof status === 'boolean') {
    if (status) {
      label = 'Aktif';
      icon = <Check sx={{ color: '#fffff' }} />;
      bgcolor = '#34d4c1'; // Hijau tua
    } else {
      label = 'Tidak Aktif';
      icon = <Cancel sx={{ color: textColor }} />;
      bgcolor = '#d32f2f'; // Merah tua
    }
  }
  // Jika bukan boolean, diasumsikan string
  else {
    switch (status.toLowerCase()) {
      case 'pending':
        label = 'Pending';
        icon = <HourglassEmpty sx={{ color: textColor }} />;
        bgcolor = '#ed6c02'; // Oranye
        break;
      case 'paid':
        label = 'Paid';
        icon = <CheckCircle sx={{ color: textColor }} />;
        bgcolor = '#34d4c1'; // Hijau tua
        break;
      case 'failed':
        label = 'Failed';
        icon = <Cancel sx={{ color: textColor }} />;
        bgcolor = '#d32f2f'; // Merah tua
        break;
      default:
        label = 'Unknown';
        icon = <Error sx={{ color: '#000' }} />;
        bgcolor = '#e0e0e0'; // Abu-abu
        textColor = '#000'; // Ubah warna teks untuk background terang
        break;
    }
  }

  return (
    <Chip
      label={label}
      icon={icon}
      size="small"
      sx={{
        backgroundColor: bgcolor, // <-- 2. Gunakan variabel bgcolor
        color: textColor,
        fontWeight: 'bold',
        p: '4px',
        borderRadius: '16px', // Bentuk pil yang lebih modern
      }}
    />
  );
};

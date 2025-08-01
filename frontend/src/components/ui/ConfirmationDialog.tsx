import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Info, // Mengganti dengan ikon Info yang lebih sesuai
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

type ConfirmColor = 'success' | 'error' | 'warning' | 'info';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: ConfirmColor;
}

export const ConfirmationDialog = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmColor = 'error',
}: ConfirmationDialogProps) => {
  // Mapping warna ke ikon dengan gaya yang lebih menonjol
  const iconMap: { [key in ConfirmColor]: React.ReactNode } = {
    success: <CheckCircle sx={{ fontSize: 64 }} />,
    error: <Cancel sx={{ fontSize: 64 }} />,
    warning: <Warning sx={{ fontSize: 64 }} />,
    info: <Info sx={{ fontSize: 64 }} />,
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 4, // Sudut lebih membulat
          textAlign: 'center',
          p: { xs: 3, sm: 4 }, // Padding responsif
          pt: { xs: 4, sm: 5 },
        },
      }}
    >
      {/* --- ICON --- */}
      <Box
        sx={{
          margin: 'auto',
          mb: 3,
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Warna latar belakang ikon yang dinamis dan halus
          bgcolor: (theme) => alpha(theme.palette[confirmColor].main, 0.1),
          color: `${confirmColor}.main`,
        }}
      >
        {iconMap[confirmColor]}
      </Box>

      {/* --- TITLE --- */}
      <DialogTitle sx={{ p: 0, fontWeight: 'bold', fontSize: '1.5rem' }}>
        {title}
      </DialogTitle>

      {/* --- CONTENT --- */}
      <DialogContent sx={{ p: 0, mt: 1 }}>
        <DialogContentText color="text.secondary">{content}</DialogContentText>
      </DialogContent>

      {/* --- ACTIONS --- */}
      <DialogActions sx={{ p: 0, mt: 4, justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit" // Tombol batal yang lebih netral
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 'none',
            px: 3,
            py: 1,
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

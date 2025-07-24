import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';

type ConfirmColor = 'success' | 'error' | 'warning' | 'info';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: ConfirmColor; // Limit to only valid values
}

export const ConfirmationDialog = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
}: ConfirmationDialogProps) => {
  // Mapping colors to icons
  const iconMap: { [key in ConfirmColor]: React.ReactNode } = {
    success: <CheckCircle color="success" fontSize="large" />,
    error: <Cancel color="error" fontSize="large" />,
    warning: <Warning color="warning" fontSize="large" />,
    info: <CheckCircle color="info" fontSize="large" />,
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ borderRadius: 2 }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          backgroundColor: '#f7f7f7',
          fontWeight: 'bold',
          padding: '16px 24px',
          fontSize: '20px',
        }}
      >
        {iconMap[confirmColor] && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {iconMap[confirmColor]}
            <Typography variant="h6" sx={{ ml: 2 }}>
              {title}
            </Typography>
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ fontSize: '16px', color: '#555' }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="primary"
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '120px',
            padding: '8px 16px',
            borderRadius: '8px',
            borderColor: '#888',
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '120px',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: 3,
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { SupplierRequest, Supplier } from '@/utils/types/SupplierType';
import { useNotification } from '@/hooks/useNotification';
import { supplierService } from '@/services/supplier/supplierService';

interface SupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  supplier: Supplier | null;
  onSuccess: () => void;
}

export const SupplierDrawer = ({
  open,
  onClose,
  editMode,
  supplier,
  onSuccess,
}: SupplierDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierRequest>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  // Reset form when drawer opens or supplier changes
  useEffect(() => {
    if (open) {
      if (editMode && supplier) {
        reset({
          name: supplier.name,
          phone: supplier.phone,
          address: supplier.address,
        });
      } else {
        reset({
          name: '',
          phone: '',
          address: '',
        });
      }
    }
  }, [open, editMode, supplier, reset]);

  const onSubmit = async (data: SupplierRequest) => {
    try {
      setSubmitting(true);
      console.log('Submitting form with data:', data);

      let response;

      if (editMode && supplier) {
        // Update existing supplier
        console.log('Updating supplier ID:', supplier.id);
        response = await supplierService.update(supplier.id, data);
        console.log('Update response:', response);

        if (response.success) {
          showNotification('Kategori berhasil diperbarui', 'success');
          onSuccess(); // Only call on success
          onClose(); // Close drawer on success
        } else {
          showNotification(
            response.message || 'Gagal memperbarui kategori',
            'error'
          );
        }
      } else {
        // Create new supplier
        response = await supplierService.create(data);
        console.log('Create response:', response);

        if (response.success) {
          showNotification('Kategori berhasil dibuat', 'success');
          onSuccess(); // Only call on success
          onClose(); // Close drawer on success
        } else {
          showNotification(
            response.message || 'Gagal membuat kategori',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      showNotification(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menyimpan kategori',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">
            {editMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Nama kategori wajib diisi',
                maxLength: {
                  value: 255,
                  message: 'Nama tidak boleh lebih dari 255 karakter',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nama Supplier"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={submitting}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Nomor Hp wajib diisi',
                maxLength: {
                  value: 255,
                  message: 'Nama tidak boleh lebih dari 255 karakter',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nomor Hp Supplier"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={submitting}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{
                required: 'Alamat wajib diisi',
                maxLength: {
                  value: 255,
                  message: 'Nama tidak boleh lebih dari 255 karakter',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Alamat Supplier"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={submitting}
                />
              )}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                className="bg-utama"
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : null}
              >
                {submitting ? 'Menyimpan...' : editMode ? 'Perbarui' : 'Buat'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

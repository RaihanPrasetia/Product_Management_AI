import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { VariantRequest, Variant } from '@/utils/types/VariantType';
import { useNotification } from '@/hooks/useNotification';
import { variantService } from '@/services/variant/variantService';

interface VariantDrawerProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  variant: Variant | null;
  onSuccess: () => void;
}

export const VariantDrawer = ({
  open,
  onClose,
  editMode,
  variant,
  onSuccess,
}: VariantDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantRequest>({
    defaultValues: {
      name: '',
      isActive: true,
    },
  });

  // Reset form when drawer opens or variant changes
  useEffect(() => {
    if (open) {
      if (editMode && variant) {
        reset({
          name: variant.name,
          isActive: variant.isActive,
        });
      } else {
        reset({
          name: '',
          isActive: true,
        });
      }
    }
  }, [open, editMode, variant, reset]);

  const onSubmit = async (data: VariantRequest) => {
    try {
      setSubmitting(true);
      console.log('Submitting form with data:', data);

      let response;

      if (editMode && variant) {
        // Update existing variant
        console.log('Updating variant ID:', variant.id);
        response = await variantService.update(variant.id, data);
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
        // Create new variant
        response = await variantService.create(data);
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
                  label="Nama Kategori"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={submitting}
                />
              )}
            />

            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={onChange}
                      disabled={submitting}
                    />
                  }
                  label="Aktif"
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

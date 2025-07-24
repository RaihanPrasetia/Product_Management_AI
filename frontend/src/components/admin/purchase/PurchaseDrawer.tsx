import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import { useNotification } from '@/hooks/useNotification';
import { purchaseService } from '@/services/purchase/purchaseService';
import { supplierService } from '@/services/supplier/supplierService'; // Asumsi ada
import { productService } from '@/services/product/productService'; // Asumsi ada
import { Purchase, PurchaseRequest } from '@/utils/types/PurchaseType';
import { Supplier } from '@/utils/types/SupplierType';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ControlledSelect } from '@/components/form/ControlledSelect';

interface ProductOption {
  value: string; // Format: "product:ID" or "variant:ID"
  label: string;
}

interface PurchaseDrawerProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean; // Note: Edit mode untuk purchase sangat kompleks, contoh ini fokus pada 'create'
  purchase: Purchase | null;
  onSuccess: () => void;
}

export const PurchaseDrawer = ({
  open,
  onClose,
  editMode,
  purchase,
  onSuccess,
}: PurchaseDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  // State untuk data master
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  console.log(purchase);
  const { control, handleSubmit, reset, setValue } = useForm<PurchaseRequest>({
    defaultValues: {
      supplierId: '',
      notes: '',
      purchaseDate: new Date().toISOString().split('T')[0], // Default ke hari ini
      items: [{ quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [supplierRes, productRes] = await Promise.all([
          supplierService.getAll(),
          productService.getAll(),
        ]);

        setSuppliers(supplierRes.suppliers || []);

        // Ubah data produk & varian menjadi satu list untuk dropdown
        const options: ProductOption[] = [];
        productRes.products?.forEach((p) => {
          if (p.type === 'SIMPLE') {
            options.push({
              value: `product:${p.id}`,
              label: `${p.name} (${p.sku})`,
            });
          } else {
            p.productVariants.forEach((pv) => {
              options.push({
                value: `variant:${pv.id}`,
                label: `${p.name} - ${pv.value} (${pv.sku})`,
              });
            });
          }
        });
        setProductOptions(options);
      } catch (error) {
        showNotification('Gagal memuat data master', 'error');
      }
    };

    if (open) {
      fetchMasterData();

      // -- LOGIKA UPDATE DIMULAI DI SINI --
      if (editMode && purchase) {
        // Map data purchase yang ada ke dalam form
        reset({
          supplierId: purchase.supplierId,
          notes: purchase.notes || '',
          purchaseDate: new Date(purchase.purchaseDate)
            .toISOString()
            .split('T')[0],
          items: purchase.items.map((item) => ({
            // Buat identifier gabungan untuk Select
            productIdentifier: item.productId
              ? `product:${item.productId}`
              : `variant:${item.productVariantId}`,
            productId: item.productId || undefined,
            productVariantId: item.productVariantId || undefined,
            quantity: item.quantity,
            price: Number(item.price),
          })),
        });
      } else {
        // Reset untuk mode 'add'
        reset({
          supplierId: '',
          notes: '',
          purchaseDate: new Date().toISOString().split('T')[0],
          items: [{ quantity: 1, price: 0 }],
        });
      }
    }
  }, [open, editMode, purchase, reset, showNotification]);

  const onSubmit: SubmitHandler<PurchaseRequest> = async (data) => {
    setSubmitting(true);
    try {
      if (editMode && purchase) {
        await purchaseService.update(purchase.id, data);
        showNotification('Pembelian berhasil diperbahauri', 'success');
        onSuccess();
        onClose();
      } else {
        await purchaseService.create(data);
        showNotification('Pembelian berhasil dibuat', 'success');
        onSuccess();
        onClose();
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Terjadi kesalahan',
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
      PaperProps={{ sx: { width: { xs: '100%', md: 800 } } }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {editMode ? 'Edit Pembelian' : 'Buat Pembelian Baru'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1">Detail Pembelian</Typography>
            <ControlledSelect
              name="supplierId"
              label="Supplier"
              control={control}
              options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            />
            <ControlledTextField
              name="purchaseDate"
              label="Tanggal Pembelian"
              control={control}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <ControlledTextField
              name="notes"
              label="Catatan (Opsional)"
              control={control}
              multiline
              rows={2}
            />
            <Divider />

            {/* --- Item Pembelian Dinamis --- */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">Item Pembelian</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => append({ quantity: 1, price: 0 })}
              >
                Tambah Item
              </Button>
            </Box>

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stack
                  key={field.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Controller
                    // Nama sementara untuk select gabungan
                    name={`items.${index}.productIdentifier` as any}
                    control={control}
                    rules={{ required: 'Item wajib dipilih' }}
                    // 'defaultValue' penting untuk mode edit
                    defaultValue={
                      purchase?.items[index]?.productId
                        ? `product:${purchase.items[index].productId}`
                        : `variant:${purchase?.items[index]?.productVariantId}`
                    }
                    render={({ field: { onChange, value, ...restField } }) => (
                      <FormControl fullWidth>
                        <InputLabel>Produk / Varian</InputLabel>
                        <Select
                          {...restField}
                          value={value || ''}
                          label="Produk / Varian"
                          onChange={(e) => {
                            const value = e.target.value as string;
                            const [type, id] = value.split(':');
                            if (type === 'product') {
                              setValue(`items.${index}.productId`, id);
                              setValue(
                                `items.${index}.productVariantId`,
                                undefined
                              );
                            } else {
                              setValue(`items.${index}.productId`, undefined);
                              setValue(`items.${index}.productVariantId`, id);
                            }
                            onChange(e);
                          }}
                        >
                          {productOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <ControlledTextField
                    name={`items.${index}.quantity`}
                    label="Jml"
                    control={control}
                    type="number"
                    numeric
                    sx={{ width: '120px' }}
                  />
                  <ControlledTextField
                    name={`items.${index}.price`}
                    label="Harga Beli"
                    control={control}
                    type="number"
                    numeric
                    sx={{ width: '200px' }}
                  />
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            pt: 3,
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {submitting ? 'Menyimpan...' : 'Simpan Pembelian'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

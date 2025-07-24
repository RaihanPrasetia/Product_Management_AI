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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNotification } from '@/hooks/useNotification';
import {
  Product,
  Category,
  Brand,
  VariantDetail,
  ProductRequest,
} from '@/utils/types/ProductType';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductVariants } from './ProductVariants';
import { categoryService } from '@/services/category/categoryService';
import { brandService } from '@/services/brand/brandService';
import { variantService } from '@/services/variant/variantService';
import { productService } from '@/services/product/productService';

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  product: Product | null;
  onSuccess: () => void;
}

export const ProductDrawer = ({
  open,
  onClose,
  editMode,
  product,
  onSuccess,
}: ProductDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [variants, setVariants] = useState<VariantDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, watch } = useForm<ProductRequest>({
    defaultValues: {
      type: 'SIMPLE',
      name: '',
      description: '',
      categoryId: '',
      brandId: '',
      sku: '',
      price: 0,
      initialStock: 0,
    },
  });

  const productType = watch('type');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes, varRes] = await Promise.all([
          categoryService.getAll(),
          brandService.getAll(),
          variantService.getAll(),
        ]);
        if (catRes.categories && brandRes.brands && varRes.variants) {
          setCategories(catRes.categories);
          setBrands(brandRes.brands);
          setVariants(varRes.variants);
          setLoading(false);
        }
      } catch (error) {
        showNotification('Gagal memuat data master', 'error');
        setLoading(false);
      }
    };

    if (open) {
      fetchInitialData();
      if (editMode && product) {
        // FIX 2: Logika reset harus kondisional untuk discriminated union
        if (product.type === 'SIMPLE') {
          reset({
            type: 'SIMPLE',
            name: product.name,
            description: product.description || '',
            categoryId: product.categoryId,
            brandId: product.brandId,
            price: Number(product.price),
            sku: product.sku || '',
            initialStock: Number(product.stock?.quantity) ?? 0,
          });
        } else {
          // product.type === 'VARIABLE'
          reset({
            type: 'VARIABLE',
            name: product.name,
            description: product.description || '',
            categoryId: product.categoryId,
            brandId: product.brandId,
            price: Number(product.price) || undefined,
            sku: product.sku || undefined,
            variants: product.productVariants.map((v) => ({
              id: v.id,
              variantId: v.variantId,
              value: v.value,
              sku: v.sku,
              price: Number(v.price) || undefined,
              initialStock: Number(v.stock?.quantity) ?? 0,
            })),
          });
        }
      } else {
        // FIX 3: Reset untuk mode 'add' juga harus valid
        reset({
          type: 'SIMPLE',
          name: '',
          description: '',
          categoryId: '',
          brandId: '',
          sku: '',
          price: 0,
          initialStock: 0,
        });
      }
    }
  }, [open, editMode, product, reset, showNotification]);

  // Tipe 'data' di sini sekarang adalah ProductRequest
  const onSubmit = async (data: ProductRequest) => {
    setSubmitting(true);
    try {
      // const payload = { ...data };
      // if (payload.type === 'VARIABLE') {
      //   // Hapus price atau sku jika nilainya tidak valid (0 atau string kosong)
      //   if (!payload.price) {
      //     delete (payload as Partial<typeof payload>).price;
      //   }
      //   if (!payload.sku) {
      //     delete (payload as Partial<typeof payload>).sku;
      //   }
      //   // Hapus initialStock dari level atas karena tidak relevan untuk produk variabel
      //   delete (payload as any).initialStock;
      // }
      if (editMode && product) {
        await productService.update(product.id, data);
        showNotification('Produk berhasil diperbarui', 'success');
      } else {
        await productService.create(data); // Pastikan service bisa handle JSON
        showNotification('Produk berhasil dibuat', 'success');
      }
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Gagal menyimpan produk';
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', md: 700 } } }}
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
          mb={3}
        >
          <Typography variant="h6">
            {editMode ? 'Edit Produk' : 'Tambah Produk Baru'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
            <Stack spacing={4}>
              <ProductBasicInfo
                control={control}
                productType={productType || 'SIMPLE'}
                categories={categories}
                brands={brands}
              />
              <Divider />
              {productType === 'VARIABLE' && (
                <ProductVariants
                  control={control}
                  fields={fields}
                  append={append}
                  remove={remove}
                  variants={variants}
                />
              )}
            </Stack>
          </Box>
        )}

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
            {submitting ? 'Menyimpan...' : editMode ? 'Update' : 'Simpan'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

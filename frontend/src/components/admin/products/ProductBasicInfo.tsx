import {
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Divider,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { Category, Brand } from '@/utils/types/ProductType';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledTextField } from '@/components/form/ControlledTextField';

interface Props {
  control: Control<any>;
  productType: 'SIMPLE' | 'VARIABLE';
  categories: Category[];
  brands: Brand[];
}

export const ProductBasicInfo = ({
  control,
  productType,
  categories,
  brands,
}: Props) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h6">Informasi Dasar</Typography>

      <FormControl component="fieldset">
        <FormLabel component="legend">Tipe Produk</FormLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel
                value="SIMPLE"
                control={<Radio />}
                label="Simple"
              />
              <FormControlLabel
                value="VARIABLE"
                control={<Radio />}
                label="Dengan Varian"
              />
            </RadioGroup>
          )}
        />
      </FormControl>

      <ControlledTextField
        name="name"
        label="Nama Produk"
        control={control}
        rules={{
          required: 'Nama produk tidak boleh kosong',
          minLength: {
            value: 3,
            message: 'Nama produk minimal 3 karakter',
          },
        }}
      />

      <ControlledTextField
        name="description"
        label="Deskripsi"
        control={control}
        multiline
        rows={4}
      />

      <Stack direction="row" spacing={2}>
        <ControlledSelect
          name="categoryId"
          label="Kategori"
          control={control}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          required
        />
        <ControlledSelect
          name="brandId"
          label="Brand"
          control={control}
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
          required
        />
      </Stack>

      {/* Tampilkan field ini hanya untuk produk SIMPLE */}
      {productType === 'SIMPLE' && (
        <>
          <Divider>
            <Typography variant="caption">Detail Produk Simple</Typography>
          </Divider>
          <Stack direction="row" spacing={2}>
            <ControlledTextField
              name="sku"
              label="SKU"
              control={control}
              required
            />
            <ControlledTextField
              name="initialStock"
              label="Stok Awal"
              control={control}
              type="number"
              numeric
              required
            />
          </Stack>
          <ControlledTextField
            name="price"
            label="Harga"
            control={control}
            type="number"
            numeric
            rules={{
              required: 'Harga tidak boleh kosong',
              min: {
                value: 1,
                message: 'Harga harus lebih dari 0',
              },
            }}
          />
        </>
      )}
    </Stack>
  );
};

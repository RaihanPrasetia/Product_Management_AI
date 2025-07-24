import {
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldArrayWithId,
} from 'react-hook-form';
import { VariantDetail } from '@/utils/types/ProductType';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { ControlledTextField } from '@/components/form/ControlledTextField';

interface Props {
  control: Control<any>;
  fields: FieldArrayWithId<any, 'variants', 'id'>[];
  append: UseFieldArrayAppend<any, 'variants'>;
  remove: UseFieldArrayRemove;
  variants: VariantDetail[];
}

export const ProductVariants = ({
  control,
  fields,
  append,
  remove,
  variants,
}: Props) => {
  const handleAddVariant = () => {
    // FIX: Berikan nilai default '' untuk field Select (variantId)
    append({
      variantId: '',
      value: '',
      sku: '',
      price: 0,
      initialStock: 0,
    });
  };

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Varian Produk</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAddVariant}>
          Tambah Varian
        </Button>
      </Box>
      <Divider />

      {fields.map((field, index) => (
        <Box key={field.id} p={2} border="1px dashed #ccc" borderRadius={2}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2">Varian #{index + 1}</Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => remove(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={2}>
              <ControlledSelect
                name={`variants.${index}.variantId`}
                label="Tipe Varian"
                control={control}
                options={variants.map((v) => ({ value: v.id, label: v.name }))}
              />
              <ControlledTextField
                name={`variants.${index}.value`}
                label="Nilai (e.g. Merah, XL)"
                control={control}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <ControlledTextField
                name={`variants.${index}.sku`}
                label="SKU Varian"
                control={control}
              />
              <ControlledTextField
                name={`variants.${index}.initialStock`}
                label="Stok Awal"
                control={control}
                type="number"
                numeric
              />
            </Stack>
            <ControlledTextField
              name={`variants.${index}.price`}
              label="Harga Varian (Opsional)"
              control={control}
              type="number"
              numeric
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, RegisterOptions } from 'react-hook-form'; // Impor RegisterOptions

type ControlledTextFieldProps = TextFieldProps & {
  name: string;
  control: Control<any>;
  numeric?: boolean;
  rules?: RegisterOptions; // <-- Tambahkan prop rules
};

export const ControlledTextField = ({
  name,
  control,
  rules,
  numeric,
  ...rest
}: ControlledTextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules} // <-- Teruskan rules ke Controller
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            if (numeric) {
              // Jika input kosong, kembalikan string kosong agar tidak menjadi NaN
              // Jika tidak, parse sebagai angka.
              const value =
                e.target.value === '' ? '' : parseInt(e.target.value, 10);
              field.onChange(value);
            } else {
              field.onChange(e.target.value); // Perilaku normal untuk non-numerik
            }
          }}
        />
      )}
    />
  );
};

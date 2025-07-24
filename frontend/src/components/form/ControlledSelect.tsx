import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import { Controller, Control } from 'react-hook-form';

type ControlledSelectProps = SelectProps & {
  name: string;
  control: Control<any>;
  options: { value: string; label: string }[];
};

export const ControlledSelect = ({
  name,
  control,
  label,
  options,
  ...rest
}: ControlledSelectProps) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={!!control.getFieldState(name).error}
    >
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select {...field} {...rest} label={label}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      <FormHelperText>
        {control.getFieldState(name).error?.message}
      </FormHelperText>
    </FormControl>
  );
};

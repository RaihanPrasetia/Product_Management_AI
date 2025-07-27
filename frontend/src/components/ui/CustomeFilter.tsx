// src/components/ui/CustomeFilter.tsx

import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { ApiParams } from '@/types/apiTypes';
import { FilterKeys } from '@/stores/pagination.slice';

// -> 2. Hapus props yang tidak lagi dibutuhkan
interface CustomeFilterProps {
  searchPlaceholder?: string;
  filters: ApiParams;
  setFilter: (key: FilterKeys, value: string | number) => void;
}

const CustomeFilter = ({
  searchPlaceholder = 'Search...',
  filters,
  setFilter,
}: CustomeFilterProps) => {
  // -> 3. Ambil state 'filters' dan aksi 'setFilter' dari store

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePaginationChange = (event: SelectChangeEvent) => {
    setFilter('limit', Number(event.target.value));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('name_contains', e.target.value);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
      }}
    >
      {/* Pagination control */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Show
        </Typography>

        <FormControl size="small" sx={{ minWidth: 40 }}>
          <Select
            value={String(filters.limit)}
            onChange={handlePaginationChange}
            displayEmpty
            variant="outlined"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5,
                },
              },
            }}
          >
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="20">20</MenuItem>
          </Select>
        </FormControl>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          items per page
        </Typography>
      </Stack>

      {/* Search input */}
      <TextField
        placeholder={searchPlaceholder}
        value={filters.name_contains}
        onChange={handleSearch}
        size="small"
        variant="outlined"
        sx={{
          width: isMobile ? '100%' : '240px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default CustomeFilter;

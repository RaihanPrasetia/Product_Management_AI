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
    SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface CustomeFilterProps {
    pagination: number;
    setPagination: (value: number) => void;
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
}

const CustomeFilter = ({
    pagination,
    setPagination,
    searchTerm,
    handleSearchChange,
    searchPlaceholder = "Search..."
}: CustomeFilterProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePaginationChange = (event: SelectChangeEvent) => {
        setPagination(Number(event.target.value));
    };

    return (
        <Box sx={{
            p: 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2
        }}>
            {/* Pagination control */}
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
            >
                <Typography variant="body2" color="text.secondary">
                    Show
                </Typography>

                <FormControl size="small" sx={{ minWidth: 40 }}>
                    <Select
                        value={String(pagination)}
                        onChange={handlePaginationChange}
                        displayEmpty
                        variant="outlined"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5
                                }
                            }
                        }}
                    >
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="20">20</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    items per page
                </Typography>
            </Stack>

            {/* Search input */}
            <TextField
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                variant="outlined"
                sx={{
                    width: isMobile ? '100%' : '240px',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    );
};

export default CustomeFilter;
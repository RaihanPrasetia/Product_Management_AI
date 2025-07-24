// src/components/products/ProductStatus.tsx
import { Box, FormControlLabel, Switch } from "@mui/material";
import { Controller } from "react-hook-form";

interface ProductStatusProps {
    control: any;
    submitting: boolean;
}

const ProductStatus = ({ control, submitting }: ProductStatusProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Controller
                name="is_published"
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
                        label="Published (Active)"
                    />
                )}
            />

            <Controller
                name="is_featured"
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
                        label="Featured Product"
                    />
                )}
            />
        </Box>
    );
};

export default ProductStatus;
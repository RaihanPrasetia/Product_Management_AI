// src/components/products/ProductSpecifications.tsx
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    Paper,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SpecificationField } from "@/utils/types/ProductType";

interface ProductSpecificationsProps {
    specFields: SpecificationField[];
    setSpecFields: (fields: SpecificationField[]) => void;
    submitting: boolean;
}

const ProductSpecifications = ({
    specFields,
    setSpecFields,
    submitting
}: ProductSpecificationsProps) => {

    const handleAddSpecField = () => {
        setSpecFields([...specFields, { key: "", value: "", id: Math.random().toString(36).substr(2, 9) }]);
    };

    const handleRemoveSpecField = (id: string) => {
        if (specFields.length > 1) {
            setSpecFields(specFields.filter(field => field.id !== id));
        }
    };

    const handleSpecKeyChange = (id: string, value: string) => {
        setSpecFields(
            specFields.map(field =>
                field.id === id ? { ...field, key: value } : field
            )
        );
    };

    const handleSpecValueChange = (id: string, value: string) => {
        setSpecFields(
            specFields.map(field =>
                field.id === id ? { ...field, value } : field
            )
        );
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="medium">
                    Product Specifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Add key-value pairs for product specifications
                </Typography>
            </Box>

            {specFields.map((field, index) => (
                <Box key={field.id} mb={2}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={5}>
                            <TextField
                                label="Key"
                                size="small"
                                fullWidth
                                value={field.key}
                                onChange={(e) => handleSpecKeyChange(field.id, e.target.value)}
                                disabled={submitting}
                                placeholder="e.g. color"
                            />
                        </Grid>
                        <Grid size={5}>
                            <TextField
                                label="Value"
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(e) => handleSpecValueChange(field.id, e.target.value)}
                                disabled={submitting}
                                placeholder="e.g. red"
                            />
                        </Grid>
                        <Grid size={2}>
                            <IconButton
                                color="error"
                                onClick={() => handleRemoveSpecField(field.id)}
                                disabled={submitting || specFields.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            ))}

            <Box mt={2}>
                <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    onClick={handleAddSpecField}
                    disabled={submitting}
                    size="small"
                >
                    Add Specification
                </Button>
            </Box>
        </Paper>
    );
};

export default ProductSpecifications;
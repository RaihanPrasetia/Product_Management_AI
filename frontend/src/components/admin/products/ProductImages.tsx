import {
    Box,
    Typography,
    Button,
    IconButton,

    Grid,
    Card,
    CardMedia,
    CardActions,

} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useRef } from "react";

interface ProductImagesProps {
    images: any[];
    onAddImages: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    onSetPrimaryImage: (index: number) => void;
    submitting: boolean;
}

const ProductImages = ({
    images,
    onAddImages,
    onRemoveImage,
    onSetPrimaryImage,
    submitting
}: ProductImagesProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            onAddImages(filesArray);

            // Reset the input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getImagePreviewUrl = (image: any): string => {
        if (image.file instanceof File) {
            return URL.createObjectURL(image.file);
        } else if (image.file_path) {
            // Assuming your backend serves images from this path
            return `${import.meta.env.VITE_API_URL}/${image.file_path}`;
        }
        return '/placeholder-image.jpg'; // Fallback placeholder
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Product Images
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={handleButtonClick}
                    disabled={submitting}
                >
                    Add Images
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/gif,image/jpg"
                    multiple
                    disabled={submitting}
                />
            </Box>

            {images.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No images uploaded yet. Product images help customers see what they're buying.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {images.map((image, index) => (
                        <Grid size={{ xs: 6, sm: 6, md: 4 }} key={index}>
                            <Card variant="outlined">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={getImagePreviewUrl(image)}
                                    alt={`Product image ${index + 1}`}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardActions disableSpacing sx={{ justifyContent: 'space-between', p: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onSetPrimaryImage(index)}
                                        disabled={submitting || image.is_primary}
                                        color={image.is_primary ? "primary" : "default"}
                                        title={image.is_primary ? "Primary Image" : "Set as Primary"}
                                    >
                                        {image.is_primary ? (
                                            <StarIcon fontSize="small" />
                                        ) : (
                                            <StarBorderIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => onRemoveImage(index)}
                                        disabled={submitting}
                                        color="error"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Typography variant="caption" color="text.secondary" mt={1} display="block">
                * The image marked with a star will be displayed as the main product image
            </Typography>
        </Box>
    );
};

export default ProductImages;
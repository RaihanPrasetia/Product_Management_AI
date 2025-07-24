import { FormattedProductType } from "@/utils/types/ProductType";
import { useCallback, useEffect, useState } from "react";
import {
    Grid,
    Box,
    // Paper,
    // Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
// import FillterProduct from "@/components/auth/product/FillterProduct";
import { useNotification } from "@/hooks/useNotification";
import productUserService from "@/services/product/productUserService";
import { UserProductList } from "@/components/auth/product/UserProductList";

export default function ProductAuth() {
    const [products, setProducts] = useState<FormattedProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [filterShow, setFilterShow] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [categoryId] = useState<string>("");
    const [perPage, setPerPage] = useState<number>(6);

    const { showNotification } = useNotification();

    // const handleToggleFilter = () => setFilterShow((prev) => !prev);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await productUserService.getProductsUser({
                search: searchQuery,
                categoryId,
                per_page: perPage,
            });
            setProducts(response.productsFormatted);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal mengambil produk";
            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, categoryId, perPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 10 }, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                {/* <Box display="flex" gap={2}>
                    <Button variant="outlined" onClick={handleToggleFilter}>
                        {filterShow ? "Tutup Filter" : "Tampilkan Filter"}
                    </Button>
                </Box> */}

                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Cari nama produk"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FormControl size="small" className="w-20">
                        <InputLabel>Per Halaman</InputLabel>
                        <Select value={perPage} label="Per Halaman" onChange={(e) => setPerPage(Number(e.target.value))}>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* {filterShow && (
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper elevation={3} sx={{ p: 2, backgroundColor: "transparent", boxShadow: "none" }}>
                            <FillterProduct />
                        </Paper>
                    </Grid>
                )} */}

                <Grid size={{ xs: 12, md: 12 }}>
                    <div>
                        <UserProductList products={products} loading={loading} />
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}

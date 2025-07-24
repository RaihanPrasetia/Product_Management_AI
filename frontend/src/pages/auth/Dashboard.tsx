import { Card, CardContent, Typography, Box, Grid, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { formatToRupiah } from "@/utils/priceFormated";
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "@/utils/types/OutletContextType";


export default function Dashboard() {
    const { cartCount, orderCount, orders } = useOutletContext<OutletContextType>();

    return (
        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 10 } }}>
            <Typography variant="h5" fontWeight="bold" paddingY={3}>
                Welcome Back!
            </Typography>

            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ backgroundColor: "#1976d2", color: "white" }}>
                        <CardContent>
                            <ShoppingCartIcon sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h6">Cart Items</Typography>
                            <Typography variant="h4" fontWeight="bold">{cartCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ backgroundColor: "#ff9800", color: "white" }}>
                        <CardContent>
                            <ReceiptIcon sx={{ fontSize: 40, mb: 2 }} />
                            <Typography variant="h6">Orders</Typography>
                            <Typography variant="h4" fontWeight="bold">{orderCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Recent Orders
                </Typography>

                {orders.length === 0 && (
                    <Typography variant="body1" color="text.secondary">No recent orders found.</Typography>
                )}

                {orders.map((order) => (
                    <Card key={order.id} variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="start">
                                <Box>
                                    <Typography fontWeight="bold">#{order.id.slice(0, 8)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Placed on {order.created_at_formatted}
                                    </Typography>
                                    <Typography variant="body2" mt={1}>
                                        Products: {order.order_items.map((item) => item.product_name).join(", ")}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" mt={1}>
                                        Status: <strong style={{ textTransform: "capitalize" }}>{order.status}</strong>
                                    </Typography>
                                    <Typography variant="body2" mt={0.5}>
                                        Total: <strong>{formatToRupiah(parseFloat(order.total_price))}</strong>
                                    </Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" size="small">View</Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>

        </Box>
    );
}

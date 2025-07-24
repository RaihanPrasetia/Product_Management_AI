import { FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNotification } from "@/hooks/useNotification";
import cartService from "@/services/cart/cartUserService";
import { FormattedCartType } from "@/utils/types/CartType";
import LoadingIndicator from "@/components/auth/cart/LoadingIndicator";
import CartSelectionSidebar from "@/components/auth/cart/CartSelectionSidebar";
import CartProductItem from "@/components/auth/cart/CartProductItem";
import { EmptyCartProduct } from "@/components/auth/cart/EmptyCartProduct";
import EmptyCart from "@/components/auth/cart/EmptyCart";
import { CartDrawer } from "@/components/auth/cart/CartDrawer";
import cartItemService from "@/services/cart/cartItemService,";
import CartCheckoutDrawer from "@/components/auth/cart/CartCheckoutDrawer";
import paymentMethodService from "@/services/paymentMethod/paymentMethod";
import { FormattedPaymentMethodType } from "@/utils/types/PaymentMethodType";

// Define the notification hook interface if it doesn't exist
interface NotificationHook {
    showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const CartAuth: FC = () => {
    const [carts, setCarts] = useState<FormattedCartType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
    const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
    const { showNotification } = useNotification() as NotificationHook;
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedCartItem, setSelectedCartItem] = useState<FormattedCartType | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<FormattedPaymentMethodType[]>([]);

    const handleOpenDrawer = (mode: "add" | "edit", cart?: FormattedCartType) => {
        if (mode === "edit" && cart) {
            setSelectedCartItem(cart);
            setEditMode(true);
        } else {
            setSelectedCartItem(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedCartItem(null);
    };

    // Initialize quantity map from cart data
    const initializeQtyMap = (cartData: FormattedCartType[]): void => {
        const newQtyMap: Record<string, number> = {};
        cartData.forEach(cart => {
            cart.products.forEach(product => {
                newQtyMap[product.cart_item_id] = product.qty;
            });
        });
        setQtyMap(newQtyMap);
    };

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const response = await paymentMethodService.getPaymentMethods();
            setPaymentMethods(response.paymentMethodsFormatted);
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message, "error");
            } else {
                showNotification("Failed to fetch products", "error");
            }
        }
    }, []);

    // Fetch carts from API
    const fetchCarts = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await cartService.getCarts();
            setCarts(response.cartsFormatted);
            initializeQtyMap(response.cartsFormatted);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal mengambil produk";
            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    // Handle quantity change
    const handleQtyChange = async (cartItemId: string, newQty: number) => {
        const safeQty = newQty < 1 ? 1 : newQty;

        // Update local state immediately for responsive UI
        setQtyMap((prev) => ({
            ...prev,
            [cartItemId]: safeQty,
        }));

        try {
            // Then update the server
            await cartItemService.updateCartItem(cartItemId, { qty: safeQty });
        } catch (err: any) {
            // If there's an error, revert to previous state or refetch to ensure consistency
            showNotification(err.message || "Gagal memperbarui kuantitas", 'error');
            fetchCarts(); // Refetch to restore correct state
        }
    };

    const handleDelete = async (cartItemId: string) => {
        try {
            await cartItemService.deleteCartItem(cartItemId);

            setQtyMap((prev) => {
                const updated = { ...prev };
                delete updated[cartItemId];
                return updated;
            });

            showNotification('Berhasil Hapus Product', 'success');
            fetchCarts();
        } catch (err: any) {
            showNotification(err.message || "Gagal menghapus produk", 'error');
        }
    };

    // Effect to fetch carts on component mount
    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    // Effect to select first cart when data loads
    useEffect(() => {
        if (carts.length > 0 && !selectedCartId) {
            setSelectedCartId(carts[0].id);
        }
    }, [carts, selectedCartId]);

    if (loading) {
        return <LoadingIndicator />;
    }

    const handleDeleteCart = async (id: string) => {
        try {
            await cartService.deleteCart(id);
            showNotification("Cart berhasil dihapus", "success");
            fetchCarts();
        } catch (error) {
            showNotification(error instanceof Error ? error.message : "Failed to delete category", "error");
        }
    };

    const handleCheckout = () => {
        fetchPaymentMethods()
        setCheckoutOpen(true)
    }

    // Find the selected cart
    const selectedCart = carts.find(cart => cart.id === selectedCartId);
    const products = selectedCart?.products || [];

    return (
        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 10 }, pt: 4 }}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h5" fontWeight="bold">
                    Daftar Keranjang
                </Typography>
                <Box className="flex justify-end my-4">
                    {carts.length > 0 &&
                        <Button
                            className="inline-block px-4 py-2 bg-utama text-white rounded-md hover:bg-purple-700 transition"
                            onClick={() => handleOpenDrawer("add")}
                        >
                            <span className='text-white'>Buat keranjang</span>
                        </Button>
                    }
                </Box>
            </Box>
            {carts.length === 0 ? (
                <EmptyCart onSuccess={() => fetchCarts()} />
            ) : (
                <Box className="flex gap-6">
                    {/* Left sidebar: Cart selection */}
                    <CartSelectionSidebar
                        carts={carts}
                        selectedCartId={selectedCartId}
                        onSelectCart={setSelectedCartId}
                        onEditCart={(cart) => handleOpenDrawer("edit", cart)}
                        onDeleteCart={(id) => handleDeleteCart(id)}
                    />

                    {/* Right content: Selected cart products */}
                    <Box className="flex-1 pt-5">
                        {selectedCartId ? (
                            <>
                                {products.length > 0 ? (
                                    <>
                                        {products.map(product => (
                                            <CartProductItem
                                                key={product.cart_item_id}
                                                product={product}
                                                qtyMap={qtyMap}
                                                onQtyChange={handleQtyChange}
                                                onDelete={handleDelete}
                                            />
                                        ))}

                                        {/* Tombol checkout muncul hanya jika ada produk */}
                                        <Box mt={3} display="flex" justifyContent="flex-end">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleCheckout}
                                            >
                                                Checkout
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <EmptyCartProduct />
                                )}
                            </>
                        ) : (
                            <Typography>Pilih salah satu keranjang di sebelah kiri.</Typography>
                        )}
                    </Box>

                </Box>
            )}

            <CartDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                editMode={editMode}
                cart={selectedCartItem}
                onSuccess={() => {
                    handleCloseDrawer();
                    fetchCarts();
                }}
            />

            <CartCheckoutDrawer
                paymentMethods={paymentMethods}
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                cart={selectedCart}
                qtyMap={qtyMap}
                onSuccess={() => fetchCarts()}
            />
        </Box>
    );
};

export default CartAuth;
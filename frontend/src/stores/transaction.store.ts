import { create } from 'zustand';
import {
  CreateSaleRequest,
  PaymentRequest,
  SaleItemRequest,
} from '@/types/SaleType';
import { Product } from '@/types/ProductType';
import { saleService } from '@/services/saleService';

// Interface tetap sama untuk mendefinisikan "bentuk" data yang akan digunakan komponen,
// meskipun kalkulasi subtotal dll. tidak lagi disimpan di dalam state.
interface TransactionState {
  items: SaleItemRequest[];
  payments: PaymentRequest[];
  notes: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  // Actions
  addItem: (product: Product, variantId?: string) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  addPayment: (payment: PaymentRequest) => void;
  removePayment: (index: number) => void;
  setNotes: (notes: string) => void;
  submitTransaction: (
    showNotification: (msg: string, type: 'success' | 'error') => void
  ) => Promise<void>;
  clearTransaction: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Initial State
  items: [],
  payments: [],
  notes: '',
  status: 'idle',
  error: null,

  // --- GETTERS DIHAPUS DARI SINI ---
  // Logika kalkulasi dipindahkan ke komponen (via selector) dan ke action di bawah.

  // Actions
  addItem: (product: Product, variantId?: string) => {
    const itemId = variantId || product.id;
    const items = get().items;
    const existingItem = items.find((i) => i.itemId === itemId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity <= existingItem.stock) {
        get().updateItemQuantity(itemId, newQuantity);
      }
      return;
    }

    let newItem: SaleItemRequest;
    if (product.type === 'VARIABLE' && variantId) {
      const variant = product.productVariants.find((v) => v.id === variantId);
      if (!variant) return;
      newItem = {
        itemId: variant.id,
        productVariantId: variant.id,
        productName: product.name,
        variantName: variant.value,
        sku: variant.sku,
        quantity: 1,
        price: Number(variant.price),
        discount: 0,
        stock: variant.stock?.quantity ?? 0,
      };
    } else {
      newItem = {
        itemId: product.id,
        productId: product.id,
        productName: product.name,
        sku: product.sku || 'N/A',
        quantity: 1,
        price: Number(product.price),
        discount: 0,
        stock: product.stock?.quantity ?? 0,
      };
    }
    set({ items: [...items, newItem] });
  },

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => (item.productVariantId || item.productId) !== itemId
      ),
    })),

  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        (item.productVariantId || item.productId) === itemId
          ? { ...item, quantity }
          : item
      ),
    })),

  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),

  removePayment: (index) =>
    set((state) => ({
      payments: state.payments.filter((_, i) => i !== index),
    })),

  setNotes: (notes) => set({ notes }),

  clearTransaction: () =>
    set({ items: [], payments: [], notes: '', status: 'idle', error: null }),

  submitTransaction: async (showNotification) => {
    const { items, payments, notes } = get();
    // ✅ Lakukan kalkulasi di sini untuk memastikan data selalu yang terbaru
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalDiscount = items.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    const totalAmount = subtotal - totalDiscount;
    const totalPaid = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Validasi menggunakan nilai yang baru dihitung
    if (items.length === 0) {
      showNotification('Keranjang tidak boleh kosong.', 'error');
      return;
    }
    if (Math.abs(totalAmount - totalPaid) > 0.01) {
      showNotification(
        'Jumlah pembayaran tidak sesuai dengan total tagihan.',
        'error'
      );
      return;
    }

    set({ status: 'loading' });

    const payload: CreateSaleRequest = { items, payments, notes };

    try {
      const res = await saleService.create(payload);
      console.log(payload);
      if (res.success) {
        set({ status: 'success' });
        showNotification('Transaksi berhasil dibuat!', 'success');
        get().clearTransaction();
      }
      set({ status: 'idle' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal membuat transaksi';
      set({ status: 'error', error: message });
      showNotification(message, 'error');
    }
  },
}));

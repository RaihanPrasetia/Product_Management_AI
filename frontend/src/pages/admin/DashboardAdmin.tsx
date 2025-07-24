import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Ikon untuk kartu statistik
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Content from '@/components/ui/content/Content';
import { ContentHead } from '@/components/ui/content/ContentHead';
import { useNotification } from '@/hooks/useNotification';
import {
  Dashboard,
  RecentPurchase,
  LowStockItem,
} from '@/utils/types/DashboardType';
import { formatToRupiah } from '@/utils/priceFormated';
import formattedDate from '@/utils/formattedDate';
import { dashboardService } from '@/services/dashboard/dashboardService';

// Sub-komponen untuk kartu statistik
const StatCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color }}>{icon}</Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Sub-komponen untuk daftar pembelian terbaru
const RecentPurchasesWidget = ({
  purchases,
}: {
  purchases: RecentPurchase[];
}) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pembelian Terbaru
        </Typography>
        <List dense>
          {purchases.map((p, index) => (
            <div key={p.id}>
              <ListItem
                onClick={() => navigate(`/purchase/detail?purchaseId=${p.id}`)}
              >
                <ListItemText
                  primary={p.invoiceNumber}
                  secondary={`Oleh ${p.supplier.name} - Total: ${formatToRupiah(
                    Number(p.totalAmount)
                  )}`}
                />
              </ListItem>
              {index < purchases.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Sub-komponen untuk daftar stok menipis
const LowStockWidget = ({ items }: { items: LowStockItem[] }) => {
  const navigate = useNavigate();
  const getItemName = (item: LowStockItem) => {
    if (item.product) return item.product.name;
    if (item.productVariant)
      return `${item.productVariant.product.name} (${item.productVariant.value})`;
    return 'N/A';
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom color="error">
          Stok Menipis
        </Typography>
        <List dense>
          {items.map((item, index) => (
            <div key={item.id}>
              <ListItem
                onClick={() =>
                  navigate(
                    `/product/detail?productId=${
                      item.productId || item.productVariant?.product?.id
                    }`
                  )
                }
              >
                <ListItemText
                  primary={getItemName(item)}
                  secondary={`Tersisa: ${item.quantity} unit`}
                />
              </ListItem>
              {index < items.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Sub-komponen untuk Skeleton Loader
const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(4)].map((_, i) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
        <Skeleton variant="rectangular" height={80} />
      </Grid>
    ))}
    <Grid size={{ xs: 12, lg: 7 }}>
      <Skeleton variant="rectangular" height={300} />
    </Grid>
    <Grid size={{ xs: 12, lg: 5 }}>
      <Skeleton variant="rectangular" height={300} />
    </Grid>
  </Grid>
);

// Komponen Utama
export default function DashboardAdmin() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getSummary();
        setDashboardData(response.data);
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : 'Gagal memuat data dashboard';
        showNotification(msg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [showNotification]);

  const stats = dashboardData?.stats;

  const dateNow = new Date();

  return (
    <Content>
      <ContentHead
        title="Dashboard"
        subTitle={`Selamat datang kembali, Admin! Hari ini tanggal ${formattedDate(
          dateNow.toISOString()
        )}.`}
      />
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <DashboardSkeleton />
        ) : stats && dashboardData ? (
          <Grid container spacing={3}>
            {/* --- Baris Kartu Statistik --- */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<Inventory2Icon fontSize="large" />}
                title="Total Produk"
                value={stats.totalProducts}
                color="primary.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<StoreIcon fontSize="large" />}
                title="Total Supplier"
                value={stats.totalSuppliers}
                color="success.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<AttachMoneyIcon fontSize="large" />}
                title="Total Nilai Stok"
                value={formatToRupiah(Number(stats.totalStockValue))}
                color="info.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<WarningAmberIcon fontSize="large" />}
                title="Item Stok Rendah"
                value={stats.lowStockItemsCount}
                color="error.main"
              />
            </Grid>

            {/* --- Baris Widget --- */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <RecentPurchasesWidget
                purchases={dashboardData.recentPurchases}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <LowStockWidget items={dashboardData.lowStockItems} />
            </Grid>
          </Grid>
        ) : (
          <Typography>Data dashboard tidak berhasil dimuat.</Typography>
        )}
      </Box>
    </Content>
  );
}

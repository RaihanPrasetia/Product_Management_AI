import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

// Ikon untuk kartu statistik
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Content from '@/components/ui/content/Content';
import { ContentHead } from '@/components/ui/content/ContentHead';
import { useNotification } from '@/hooks/useNotification';
import { Dashboard } from '@/types/DashboardType';
import { formatCurrency } from '@/utils/formatCurrency';
import { dashboardService } from '@/services/dashboardService';
import StatCard from '@/components/admin/dashboard/StatCard';
import LowStockWidget from '@/components/admin/dashboard/LowStockWidget';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SalesTrendChart from '@/components/admin/dashboard/SalesTrendChart';
import PaymentDistributionChart from '@/components/admin/dashboard/PaymentDistributionChart';
import TopProductsWidget from '@/components/admin/dashboard/TopProductsWidget';
import RecentSalesWidget from '@/components/admin/dashboard/RecentSalesWidget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(4)].map((_, i) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
        <Skeleton variant="rectangular" height={80} />
      </Grid>
    ))}
    <Grid size={{ xs: 12, lg: 8 }}>
      <Skeleton variant="rectangular" height={500} />
    </Grid>
    <Grid size={{ xs: 12, lg: 4 }}>
      <Skeleton variant="rectangular" height={500} />
    </Grid>
    <Grid size={{ xs: 12, lg: 6 }}>
      <Skeleton variant="rectangular" height={300} />
    </Grid>
    <Grid size={{ xs: 12, lg: 6 }}>
      <Skeleton variant="rectangular" height={300} />
    </Grid>
  </Grid>
);

// Komponen Utama
export default function DashboardAdmin() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const endDate = new Date();
        const startDate = new Date();
        if (period === '7d') startDate.setDate(endDate.getDate() - 6);
        if (period === '30d') startDate.setDate(endDate.getDate() - 29);
        if (period === '90d') startDate.setDate(endDate.getDate() - 89);

        const response = await dashboardService.getSummary({
          startDate,
          endDate,
        });
        setDashboardData(response.data);
      } catch (error) {
        // ... (error handling tetap sama)
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [showNotification, period]);

  const stats = dashboardData?.stats;

  return (
    <Content>
      <ContentHead
        title="Dashboard"
        subTitle={`Ringkasan performa bisnis Anda.`}
      >
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, newPeriod) => {
            if (newPeriod) setPeriod(newPeriod);
          }}
          size="small"
        >
          <ToggleButton value="7d">7 Hari</ToggleButton>
          <ToggleButton value="30d">30 Hari</ToggleButton>
          <ToggleButton value="90d">90 Hari</ToggleButton>
        </ToggleButtonGroup>
      </ContentHead>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <DashboardSkeleton />
        ) : stats && dashboardData ? (
          <Grid height="100%" container spacing={3}>
            {/* --- Baris Kartu Statistik --- */}
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <StatCard
                icon={<AttachMoneyIcon />}
                title="Total Penjualan"
                value={formatCurrency(Number(stats.totalSales))}
                color="primary.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <StatCard
                icon={<Inventory2Icon />}
                title="Total Produk"
                value={stats.totalProducts}
                color="info.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <StatCard
                icon={<StoreIcon />}
                title="Total Supplier"
                value={stats.totalSuppliers}
                color="success.main"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<WarningAmberIcon />}
                title="Item Stok Rendah"
                value={stats.lowStockItemsCount}
                color="error.main"
              />
            </Grid>

            {/* --- Baris Grafik Utama --- */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <SalesTrendChart data={dashboardData.salesByDay} />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2}>
                <LowStockWidget items={dashboardData.lowStockItems} />

                <PaymentDistributionChart
                  data={dashboardData.paymentMethodDistribution}
                />
              </Stack>
            </Grid>

            {/* --- Baris Widget Performa --- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TopProductsWidget items={dashboardData.topSellingProducts} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RecentSalesWidget sales={dashboardData.recentSales} />
            </Grid>
          </Grid>
        ) : (
          <Typography>Data tidak berhasil dimuat.</Typography>
        )}
      </Box>
    </Content>
  );
}

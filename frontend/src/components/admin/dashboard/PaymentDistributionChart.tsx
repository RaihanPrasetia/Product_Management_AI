import CustomCard from '@/components/ui/content/CustomeCard';
import { PaymentMethodDistribution } from '@/types/DashboardType';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

const PaymentDistributionChart = ({
  data,
}: {
  data: PaymentMethodDistribution[];
}) => {
  const chartData = {
    labels: data.map((d) => d.paymentMethod),
    datasets: [
      {
        data: data.map((d) => Number(d.amount)),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };
  return (
    <CustomCard>
      <Typography variant="h6" gutterBottom>
        Metode Pembayaran
      </Typography>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Doughnut
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </Box>
    </CustomCard>
  );
};

export default PaymentDistributionChart;

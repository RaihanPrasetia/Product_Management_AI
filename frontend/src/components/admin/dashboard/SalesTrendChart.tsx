import CustomCard from '@/components/ui/content/CustomeCard';
import { SalesByDay } from '@/types/DashboardType';
import { formattedDate } from '@/utils/formattedDate';
import { Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

const SalesTrendChart = ({ data }: { data: SalesByDay[] }) => {
  const chartData = {
    labels: data.map((d) => formattedDate(d.date)),
    datasets: [
      {
        label: 'Total Penjualan',
        data: data.map((d) => Number(d.total)),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };
  return (
    <CustomCard>
      <Typography variant="h6" gutterBottom>
        Tren Penjualan
      </Typography>
      <Line data={chartData} />
    </CustomCard>
  );
};

export default SalesTrendChart;

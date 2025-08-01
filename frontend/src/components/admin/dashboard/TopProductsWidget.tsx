import CustomCard from '@/components/ui/content/CustomeCard';
import { TopSellingProduct } from '@/types/DashboardType';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';

const TopProductsWidget = ({ items }: { items: TopSellingProduct[] }) => (
  <CustomCard>
    <Typography variant="h6" gutterBottom>
      Produk Terlaris
    </Typography>
    <Stack spacing={2}>
      {items.map((item, index) => (
        <Box key={index}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{item.name}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {item.quantitySold} terjual
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(item.quantitySold / items[0].quantitySold) * 100}
          />
        </Box>
      ))}
    </Stack>
  </CustomCard>
);

export default TopProductsWidget;

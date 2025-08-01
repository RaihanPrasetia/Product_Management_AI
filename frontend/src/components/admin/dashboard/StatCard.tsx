import CustomCard from '@/components/ui/content/CustomeCard';
import { Box, Stack, Typography } from '@mui/material';

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
  <CustomCard>
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
  </CustomCard>
);

export default StatCard;

import CustomCard from '@/components/ui/content/CustomeCard';
import { RecentSale } from '@/types/DashboardType';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RecentSalesWidget = ({ sales }: { sales: RecentSale[] }) => {
  const navigate = useNavigate();
  return (
    <CustomCard>
      <Typography variant="h6" gutterBottom>
        Penjualan Terbaru
      </Typography>
      <List dense disablePadding>
        {sales.map((s, i) => (
          <div key={s.id}>
            <ListItem disablePadding>
              <ListItemButton
                className="text-utama-hover"
                onClick={() => navigate(`/sale/detail?saleId=${s.id}`)}
              >
                <ListItemText
                  primary={s.invoiceNumber}
                  secondary={`oleh ${s.createdBy.name} - ${formatCurrency(
                    Number(s.totalAmount)
                  )}`}
                />
              </ListItemButton>
            </ListItem>
            {i < sales.length - 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </CustomCard>
  );
};

export default RecentSalesWidget;

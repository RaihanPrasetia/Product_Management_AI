import CustomCard from '@/components/ui/content/CustomeCard';
import { RecentPurchase } from '@/types/DashboardType';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RecentPurchasesWidget = ({
  purchases,
}: {
  purchases: RecentPurchase[];
}) => {
  const navigate = useNavigate();
  return (
    <CustomCard>
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
                className="text-utama-hover hover:cursor-pointer"
                primary={p.invoiceNumber}
                secondary={`Oleh ${p.supplier.name} - Total: ${formatCurrency(
                  Number(p.totalAmount)
                )}`}
              />
            </ListItem>
            {index < purchases.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </CustomCard>
  );
};

export default RecentPurchasesWidget;

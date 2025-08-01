import CustomCard from '@/components/ui/content/CustomeCard';
import { LowStockItem } from '@/types/DashboardType';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LowStockWidget = ({ items }: { items: LowStockItem[] }) => {
  const navigate = useNavigate();
  const getItemName = (item: LowStockItem) => {
    if (item.product) return item.product.name;
    if (item.productVariant)
      return `${item.productVariant.product.name} (${item.productVariant.value})`;
    return 'N/A';
  };
  return (
    <CustomCard>
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
                    item.product?.id || item.productVariant?.product?.id
                  }`
                )
              }
            >
              <ListItemText
                className="text-utama-hover hover:cursor-pointer"
                primary={getItemName(item)}
                secondary={`Tersisa: ${item.quantity} unit`}
              />
            </ListItem>
            {index < items.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </CustomCard>
  );
};

export default LowStockWidget;

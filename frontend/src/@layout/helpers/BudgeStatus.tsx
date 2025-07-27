import { Badge } from "@mui/material";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          badgeContent="Pending"
          color="warning"
          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
        />
      );
    case "paid":
      return (
        <Badge
          badgeContent="Paid"
          color="success"
          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
        />
      );
    case "failed":
      return (
        <Badge
          badgeContent="Failed"
          color="error"
          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
        />
      );
    default:
      return (
        <Badge
          badgeContent="Unknown"
          color="default"
          sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
        />
      );
  }
};

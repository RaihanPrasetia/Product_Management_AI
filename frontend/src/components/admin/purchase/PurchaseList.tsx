import { useState } from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/Pagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Purchase } from '@/utils/types/PurchaseType';
import formattedDate from '@/utils/formattedDate'; // <-- Nama import diperbaiki
import { formatToRupiah } from '@/utils/priceFormated';
import { useNavigate } from 'react-router-dom';

type PurchaseListProps = {
  purchases: Purchase[];
  loading: boolean;
  onEdit: (purchase: Purchase) => void;
};

export const PurchaseList = ({
  purchases,
  loading,
  onEdit,
}: PurchaseListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPurchases.length / rowsPerPage);

  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleToDetail = (id: string) => {
    navigate(`/purchase/detail?purchaseId=${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box className="w-full h-[200px] flex flex-col justify-center items-center gap-4">
        <FaSpinner className="animate-spin text-primary text-3xl" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <CustomeFilter
          pagination={rowsPerPage}
          setPagination={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table aria-label="purchase table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }}>No</TableCell>
                <TableCell sx={{ width: '25%' }}>Nomor Invoice</TableCell>
                <TableCell sx={{ width: '25%' }}>Supplier</TableCell>
                <TableCell sx={{ width: '20%' }}>Tanggal Pembelian</TableCell>
                <TableCell sx={{ width: '15%' }} align="right">
                  Total
                </TableCell>
                <TableCell sx={{ width: '15%' }} align="right">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedPurchases.map((purchase, index) => (
                <TableRow
                  key={purchase.id}
                  hover
                  sx={{
                    backgroundColor: purchase.deletedAt ? '#f7f7f7' : 'inherit',
                    '& .MuiTableCell-root': {
                      color: purchase.deletedAt ? '#999' : 'inherit',
                    },
                  }}
                >
                  <TableCell>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="primary"
                      onClick={() => handleToDetail(purchase.id)} // Aksi untuk melihat detail
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {purchase.invoiceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{purchase.supplier?.name || '-'}</TableCell>
                  <TableCell>{formattedDate(purchase.purchaseDate)}</TableCell>
                  <TableCell align="right">
                    {formatToRupiah(Number(purchase.totalAmount))}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(purchase)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPurchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Data pembelian tidak ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="w-full flex justify-end items-center py-4 gap-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </>
  );
};

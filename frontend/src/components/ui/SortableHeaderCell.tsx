// src/components/ui/SortableHeaderCell.tsx
import React from 'react';
import { TableCell, TableSortLabel } from '@mui/material';

// -> 1. Definisikan props baru yang lebih generik
interface SortableHeaderCellProps {
  children: React.ReactNode;
  sortKey: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  onSort: (sortKey: string) => void;
}

export const SortableHeaderCell: React.FC<SortableHeaderCellProps> = ({
  children,
  sortKey,
  orderBy,
  orderDirection,
  onSort,
}) => {
  // -> 2. Hapus panggilan ke useProductStore, gunakan props sebagai gantinya
  const isActive = orderBy === sortKey;

  return (
    <TableCell
      sortDirection={isActive ? orderDirection : false}
      onClick={() => onSort(sortKey)} // -> 3. Panggil onSort dari props
      sx={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <TableSortLabel
        active={isActive}
        direction={isActive ? orderDirection : 'asc'}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
};

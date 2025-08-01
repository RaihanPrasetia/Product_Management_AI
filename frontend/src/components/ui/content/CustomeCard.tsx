// components/CustomCard.tsx
import React from 'react';
import clsx from 'clsx';

// 1. Definisikan tipe untuk variasi kartu
type CardType = 'default' | 'flat' | 'compact';

interface CustomCardProps {
  children?: React.ReactNode;
  className?: string; // Prop untuk menerima class tambahan dari luar
  type?: CardType;
}

// Perbaikan typo: CustomeCard -> CustomCard
export const CustomCard = ({
  children,
  className,
  type = 'default', // Nilai default jika tidak ditentukan
}: CustomCardProps) => {
  return (
    // 2. Gunakan clsx untuk menggabungkan class secara dinamis
    <div
      className={clsx(
        'rounded-md overflow-hidden bg-white', // Class dasar
        {
          // Class kondisional berdasarkan 'type'
          'shadow-md p-4': type === 'default',
          'border border-gray-200 p-4': type === 'flat',
          'shadow-md p-2': type === 'compact',
        },
        className // 3. Gabungkan dengan class tambahan dari props
      )}
    >
      {children}
    </div>
  );
};

export default CustomCard;

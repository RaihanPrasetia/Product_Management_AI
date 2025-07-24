// Tipe untuk data yang dikirim saat membuat/update kategori
export interface BrandRequest {
  name: string;
  isActive: boolean;
}

// Tipe untuk objek Kategori yang diterima dari API
export interface Brand {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

// Tipe untuk response API yang mengembalikan BANYAK kategori
export interface BrandApiResponse {
  success: boolean;
  message: string;
  brands?: Brand[];
  brand?: Brand;
}

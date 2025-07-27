// Tipe untuk data yang dikirim saat membuat/update kategori
export interface VariantRequest {
  name: string;
  isActive: boolean;
}

// Tipe untuk objek Kategori yang diterima dari API
export interface Variant {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

// Tipe untuk response API yang mengembalikan BANYAK kategori
export interface VariantApiResponse {
  success: boolean;
  message: string;
  variants?: Variant[];
  variant?: Variant;
}

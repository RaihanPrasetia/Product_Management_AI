// Tipe untuk data yang dikirim saat membuat/update kategori
export interface CategoryRequest {
  name: string;
  isActive: boolean;
}

// Tipe untuk objek Kategori yang diterima dari API
export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

// Tipe untuk response API yang mengembalikan BANYAK kategori
export interface CategoryApiResponse {
  success: boolean;
  message: string;
  categories?: Category[];
  category?: Category;
}

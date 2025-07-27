export interface CategoryRequest {
  name: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

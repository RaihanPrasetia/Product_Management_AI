export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdById: string;
}

export interface SupplierRequest {
  name: string;
  phone: string;
  address: string;
}

export interface SupplierApiResponse {
  success: boolean;
  message: string;
  suppliers?: Supplier[];
  supplier?: Supplier;
}

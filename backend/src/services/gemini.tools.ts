// src/services/gemini.tools.ts

import { FunctionDeclarationsTool, SchemaType } from '@google/generative-ai';

// Interface untuk find_products (sudah benar)
export interface FindProductsArgs {
  name?: string;
  categoryName?: string;
  brandName?: string;
  type?: 'SIMPLE' | 'VARIABLE';
}

// -> SARAN: Buat juga interface untuk create_product agar type-safe di controller
export interface CreateProductArgs {
  name: string;
  description?: string;
  productType: 'SIMPLE' | 'VARIABLE';
  categoryId: string;
  brandId: string;
  sku?: string;
  price?: number;
  initialStock?: number;
  variants?: {
    value: string;
    sku: string;
    price?: number;
    variantId: string;
    initialStock: number;
  }[];
}

export const productTools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      {
        name: 'find_products',
        description:
          'Mencari dan menampilkan daftar produk dengan opsi filter.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: {
              type: SchemaType.STRING,
              description: 'Filter produk yang namanya mengandung teks ini.',
            },
            categoryName: {
              type: SchemaType.STRING,
              description:
                'Filter produk berdasarkan NAMA kategori (misal: "Aksesoris").',
            },
            brandName: {
              type: SchemaType.STRING,
              description:
                'Filter produk berdasarkan NAMA merek (misal: "Optik Seis").',
            },
            // -> FIX 1: Ganti nama 'ProductType' menjadi 'productType' (camelCase)
            type: {
              type: SchemaType.STRING,
              description:
                "Filter berdasarkan tipe produk: 'SIMPLE' atau 'VARIABLE'.",
              format: 'enum',
              enum: ['SIMPLE', 'VARIABLE'],
            },
          },
        },
      },
      {
        name: 'get_stock_report_by_product',
        description:
          'Mendapatkan laporan stok lengkap, termasuk jumlah saat ini dan riwayatnya, untuk sebuah produk.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productIdentifier: {
              type: SchemaType.STRING,
              description:
                'ID, SKU, atau nama dari produk yang ingin dicari laporannya.',
            },
          },
          required: ['productIdentifier'],
        },
      },
      {
        name: 'create_product',
        description: 'Membuat produk baru, baik tipe SIMPLE maupun VARIABLE.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING, description: 'Nama produk.' },
            description: {
              type: SchemaType.STRING,
              description: 'Deskripsi produk.',
            },
            productType: {
              type: SchemaType.STRING,
              description: "Tipe produk: 'SIMPLE' atau 'VARIABLE'.",
              format: 'enum',
              enum: ['SIMPLE', 'VARIABLE'],
            },
            categoryId: {
              type: SchemaType.STRING,
              description: 'ID Kategori produk.',
            },
            brandId: {
              type: SchemaType.STRING,
              description: 'ID Merek produk.',
            },
            sku: {
              type: SchemaType.STRING,
              description: 'SKU, wajib jika tipe SIMPLE.',
            },
            price: {
              type: SchemaType.NUMBER,
              description: 'Harga, wajib jika tipe SIMPLE.',
            },
            initialStock: {
              type: SchemaType.NUMBER,
              description: 'Jumlah stok awal, untuk tipe SIMPLE.',
            },
            variants: {
              type: SchemaType.ARRAY,
              description: 'Daftar varian, wajib jika tipe VARIABLE.',
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  value: {
                    type: SchemaType.STRING,
                    description: 'Nilai varian (misal: "Merah", "XL").',
                  },
                  sku: {
                    type: SchemaType.STRING,
                    description: 'SKU unik untuk varian ini.',
                  },
                  price: {
                    type: SchemaType.NUMBER,
                    description: 'Harga spesifik untuk varian ini.',
                  },
                  variantId: {
                    type: SchemaType.STRING,
                    description:
                      'ID dari tipe varian (misal: ID untuk "Warna").',
                  },
                  initialStock: {
                    type: SchemaType.NUMBER,
                    description: 'Jumlah stok awal untuk varian ini.',
                  },
                },
                required: ['value', 'sku', 'variantId', 'initialStock'],
              },
            },
          },
          // -> Perbarui 'required' sesuai dengan nama baru
          required: ['name', 'productType', 'categoryId', 'brandId'],
        },
      },
    ],
  },
];

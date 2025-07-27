// src/services/gemini.tools.ts

import { FunctionDeclarationsTool, SchemaType } from '@google/generative-ai';

export const productTools: FunctionDeclarationsTool[] = [
  {
    functionDeclarations: [
      /**
       * Tool untuk mencari dan memfilter produk.
       * Contoh: "Cari semua kemeja dari merek X"
       * "Tampilkan produk simpel saja"
       */
      {
        name: 'find_products',
        description:
          'Mencari dan menampilkan daftar produk dengan opsi filter.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            nameContains: {
              type: SchemaType.STRING,
              description: 'Filter produk yang namanya mengandung teks ini.',
            },
            categoryId: {
              type: SchemaType.STRING,
              description: 'Filter produk berdasarkan ID kategori.',
            },
            brandId: {
              type: SchemaType.STRING,
              description: 'Filter produk berdasarkan ID merek.',
            },
            productType: {
              type: SchemaType.STRING,
              description:
                "Filter berdasarkan tipe produk: 'SIMPLE' atau 'VARIABLE'.",
              format: 'enum',
              enum: ['SIMPLE', 'VARIABLE'],
            },
          },
        },
      },
      /**
       * Tool untuk mendapatkan informasi stok berdasarkan SKU.
       * Contoh: "Berapa stok untuk SKU 'KEMEJA-BIRU-L'?"
       */
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
      /**
       * Tool untuk membuat produk baru.
       * Contoh: "Buat produk baru: Kemeja Polos, tipe SIMPLE, SKU 'KMP-01', harga 150000, stok awal 50."
       * "Tambahkan produk 'Sepatu Lari' tipe VARIABLE dengan varian warna Merah dan Biru."
       */
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
            type: {
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
            // Fields untuk produk SIMPLE
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
            // Fields untuk produk VARIABLE
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
          required: ['name', 'type', 'categoryId', 'brandId'],
        },
      },
    ],
  },
];

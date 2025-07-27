### Panduan Instalasi Aplikasi Web (Fullstack)

### 1\. Prasyarat

Sebelum memulai, pastikan Anda telah menginstal beberapa *tool* dasar ini di sistem Anda:

  * **Node.js & npm (atau Yarn)**: Anda bisa mengunduhnya dari [situs resmi Node.js](https://nodejs.org/). Pastikan versi Node.js Anda 18 ke atas.
  * **Git**: Untuk mengkloning repositori. Unduh dari [situs resmi Git](https://git-scm.com/downloads).
  * **PostgreSQL**: Database yang Anda gunakan. Instal PostgreSQL di sistem Anda. Anda bisa mengunduhnya dari [situs resmi PostgreSQL](https://www.postgresql.org/download/). Pastikan juga Anda memiliki *tool* untuk mengelola database seperti **pgAdmin** atau **DBeaver**.

-----

### 2\. Kloning Repositori

Pertama, Anda perlu mengkloning repositori proyek Anda dari GitHub:

```bash
git clone https://github.com/RaihanPrasetia/Product_Management_AI.git
cd Product_Management_AI
```

-----

### 3\. Instalasi dan Konfigurasi Backend (Express, TypeScript, Prisma, PostgreSQL, Gemini AI)

1.  **Navigasi ke Direktori Backend**:

    ```bash
    cd backend
    ```

2.  **Instal Dependensi**:

    ```bash
    npm install
    # atau jika Anda menggunakan yarn
    # yarn install
    ```

3.  **Siapkan Environment Variables**:

      * Buat file `.env` di dalam direktori `backend` Anda.
      * Salin isi dari `.env.example` yang sudah Anda buat, lalu isi nilai-nilai yang sesuai:
        ```dotenv
        # Server Configuration
        NODE_ENV="development"
        PORT=9000
        API_KEY="ISI_API_KEY_ANDA_DI_SINI" # Kunci API kustom Anda

        # JWT Configuration
        JWT_SECRET="ISI_JWT_SECRET_ANDA_DI_SINI" # Kunci rahasia JWT yang kuat
        JWT_EXPIRES_IN=86400

        # Database Configuration (Prisma)
        DATABASE_URL="postgresql://user:password@host:port/database_name" # Pastikan user, password, host, port, dan nama DB sesuai

        # CORS Configuration
        CORS_CREDENTIALS=true

        # Frontend
        FRONTEND_URL=http://localhost:5173

        # GEMINI
        GEMINI_API_KEY="" # Ganti dengan API Key Gemini Anda yang sebenarnya
        ```
      * **Penting**: Pastikan `DATABASE_URL` sesuai dengan konfigurasi PostgreSQL Anda. Anda mungkin perlu membuat database bernama `product_management` terlebih dahulu di PostgreSQL.

4.  **Inisialisasi Database dengan Prisma**:

      * **Jalankan Migrasi Prisma**: Perintah ini akan membuat skema database berdasarkan model Prisma Anda.
        ```bash
        npx prisma migrate dev --name init
        ```
      * **Jalankan Prisma Generate**: Ini akan menghasilkan *Prisma Client* yang diperlukan untuk berinteraksi dengan database Anda.
        ```bash
        npx prisma generate
        ```
      * **Jalankan Seeder Anda**: Setelah skema database dibuat, Anda bisa menjalankan skrip seeder Anda.
        ```bash
        npx prisma db seed
        # atau jika Anda menggunakan yarn
        # yarn seed
        ```
          * **Catatan Penting**: Detail akun atau data awal yang dimasukkan oleh seeder dapat dilihat di file `backend/prisma/seed.ts`. Ini berguna untuk login atau eksplorasi awal aplikasi Anda.

5.  **Jalankan Aplikasi Backend**:

    ```bash
    npm run dev
    # atau jika Anda menggunakan yarn
    # yarn dev
    ```

    Server backend Anda seharusnya sekarang berjalan di `http://localhost:9000`. Anda bisa menguji endpoint `/status` di browser atau Postman: `http://localhost:9000/status`.

-----

### 4\. Instalasi dan Konfigurasi Frontend (Vite, React, TypeScript, Framer Motion, Tailwind, MUI)

1.  **Navigasi ke Direktori Frontend**:

      * Buka terminal baru atau kembali ke direktori root `Product_Management_AI`, lalu masuk ke direktori `frontend`:
        ```bash
        cd ../frontend
        ```

2.  **Instal Dependensi**:

    ```bash
    npm install
    # atau jika Anda menggunakan yarn
    # yarn install
    ```

3.  **Konfigurasi Environment Variables Frontend**:

      * Buat file `.env` di dalam direktori `frontend` Anda.
      * Tambahkan variabel lingkungan untuk URL backend Anda:
        ```dotenv
        VITE_BACKEND_URL=http://localhost:9000/api
        ```
        *Catatan*: Untuk aplikasi Vite, variabel lingkungan harus diawali dengan `VITE_` agar diekspos ke kode *client-side*.

4.  **Jalankan Aplikasi Frontend**:

    ```bash
    npm run dev
    # atau jika Anda menggunakan yarn
    # yarn dev
    ```

    Aplikasi frontend Anda seharusnya sekarang berjalan di `http://localhost:5173` (atau port lain yang tersedia).

-----

### 5\. Mengakses Aplikasi Anda

Setelah kedua *backend* dan *frontend* berhasil berjalan, Anda bisa mengakses aplikasi Anda melalui browser:

  * **Frontend**: Buka `http://localhost:5173`
  * **Backend API Status**: Buka `http://localhost:9000/status`

-----

## Pemecahan Masalah Umum

-----

### **Port Sudah Digunakan**

Jika Anda menghadapi *error* "Port is already in use", ini berarti port yang dicoba digunakan oleh aplikasi *backend* Anda sedang dipakai oleh program lain.

  * **Solusi**:
      * Ubah nilai `PORT` di file `.env` direktori `backend` Anda ke angka lain yang belum digunakan (misalnya, dari `9000` menjadi `9001`).
      * **Penting**: Setelah mengubah port *backend*, pastikan Anda juga memperbarui `VITE_BACKEND_URL` di file `.env` direktori `frontend` Anda agar sesuai dengan port yang baru (misalnya, `VITE_BACKEND_URL=http://localhost:9001/api`).

-----

### **Koneksi Database Gagal**

Ini adalah masalah umum yang bisa muncul karena beberapa alasan terkait PostgreSQL dan Prisma.

  * **Solusi**:
      * **Pastikan Server PostgreSQL Berjalan**: Periksa apakah layanan PostgreSQL Anda aktif dan berjalan di sistem Anda.
      * **Verifikasi `DATABASE_URL`**: Buka file `.env` di direktori `backend` Anda. Pastikan **nama pengguna**, **kata sandi**, **host**, **port**, dan **nama database** dalam `DATABASE_URL` sudah benar dan sesuai dengan konfigurasi PostgreSQL Anda.
          * Contoh format: `postgresql://user:password@host:port/database_name`
      * **Buat Database (Jika Belum Ada)**: Pastikan Anda sudah membuat database dengan nama yang sama di server PostgreSQL Anda (misalnya, `product_management`). Prisma tidak otomatis membuat database, hanya tabel di dalamnya.
      * **Jalankan Migrasi Ulang (Jika Ada Perubahan Skema)**: Jika Anda melakukan perubahan pada skema Prisma (`schema.prisma`), coba jalankan perintah migrasi lagi:
        ```bash
        npx prisma migrate dev --name nama-migrasi-baru
        ```
        Ganti `nama-migrasi-baru` dengan nama deskriptif untuk migrasi Anda.

-----

### **CORS Error**

*Cross-Origin Resource Sharing* (CORS) *error* terjadi ketika *browser* memblokir permintaan dari satu *origin* (URL *frontend* Anda) ke *origin* lain (URL *backend* Anda) karena alasan keamanan.

  * **Solusi**:
      * **Verifikasi `FRONTEND_URL`**: Pastikan nilai `FRONTEND_URL` di file `.env` direktori `backend` Anda **sama persis** dengan URL tempat *frontend* Anda berjalan (misalnya, `http://localhost:5173`). Perhatikan *protocol* (`http` atau `https`) dan *port*-nya.

-----

### **API Key atau JWT Secret Tidak Ditemukan/Tidak Valid**

Jika Anda mengalami masalah otentikasi atau otorisasi, kemungkinan terkait dengan kunci rahasia yang tidak terisi atau salah.

  * **Solusi**:
      * **Isi Nilai di `.env`**: Pastikan Anda telah mengisi nilai untuk `API_KEY` dan `JWT_SECRET` di file `.env` direktori `backend` Anda.
      * **Gunakan Nilai Kuat**: Untuk `JWT_SECRET`, gunakan string acak yang panjang dan kompleks untuk keamanan yang lebih baik. Anda bisa menghasilkan satu dengan *tool* *online* atau `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

-----

Semoga panduan ini membantu Anda dalam menginstal dan menjalankan aplikasi Anda\! Jika Anda menemukan masalah atau memerlukan bantuan lebih lanjut, jangan ragu untuk bertanya.

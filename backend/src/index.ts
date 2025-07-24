import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import corsHelper from './helpers/cors.helper';
import apiKeyMiddleware from './middlewares/apiKey.middleware';
import router from './routes/index.routes';
import { globalErrorHandler } from './middlewares/error.middleware';

// Konfigurasi environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Mem-parse body request sebagai JSON

app.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Product Management API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Pindahkan middleware static bebas akses tanpa apiKeyMiddleware
app.use('/uploads', express.static(path.resolve('src/uploads')));

// middlewares yang butuh API Key
app.use(corsHelper());
app.use(apiKeyMiddleware);

app.use('/api', router); // Gunakan rute otentikasi

app.use(globalErrorHandler);

const PORT = parseInt(process.env.PORT || '8080');
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

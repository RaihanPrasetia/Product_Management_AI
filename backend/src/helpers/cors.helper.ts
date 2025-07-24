import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-api-key',
    'Access-Control-Allow-Headers',
    'Origin',
    'Accept',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  maxAge: 86400, // 24 jam
};

const corsHelper = () => cors(corsOptions);

export default corsHelper;

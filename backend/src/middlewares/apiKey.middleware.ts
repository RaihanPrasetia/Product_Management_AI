import validateApiKey from '@/helpers/apiKey.helper';
import { Request, Response, NextFunction } from 'express';

// Extend interface Request supaya bisa menampung properti apiKey
declare module 'express-serve-static-core' {
  interface Request {
    apiKey?: string;
  }
}

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'];

  const key = Array.isArray(apiKey) ? apiKey[0] : apiKey;

  if (!key) {
    res.status(403).json({ message: 'Forbidden Missing Key' });
    return;
  }

  if (!validateApiKey(key)) {
    res.status(403).json({ message: 'Forbidden Missing Key' });
    return;
  }

  req.apiKey = key;

  next();
};

export default apiKeyMiddleware;

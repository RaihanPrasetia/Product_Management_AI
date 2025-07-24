import dotenv from 'dotenv';
dotenv.config();

const validateApiKey = (apiKey: string): boolean => {
  if (apiKey !== process.env.API_KEY) {
    return false;
  }
  return true;
};

export default validateApiKey;

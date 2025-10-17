import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  digitalOcean: {
    apiKey: process.env.DO_GRADIENT_API_KEY || '',
    endpoint: process.env.DO_GRADIENT_ENDPOINT || '',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export const validateConfig = (): void => {
  if (!config.gemini.apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set. API calls will fail.');
  }
};

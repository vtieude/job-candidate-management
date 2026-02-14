import { AppConfig } from '../interfaces/app.interface';
import 'dotenv/config';
export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV as AppConfig['nodeEnv'],
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    // dbName: process.env.MONGO_DB!,
    // dbUser: process.env.MONGO_USER!,
    // dbPass: process.env.MONGO_PASS!,
    dbUrl: process.env.MONGODB_URI!,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'my-secret-key',
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '600', 10),
  },
  redis: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined,
};

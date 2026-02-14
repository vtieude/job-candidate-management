export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  database: {
    dbUrl: string;
    // dbUser: string;
    // dbPass: string;
    // dbName: string;
  };
  jwt: {
    secret: string;
    expiresIn: number; // e.g. '1h'
  };
  redis?: {
    url?: string;
  };
}

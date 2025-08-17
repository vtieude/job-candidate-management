import { IConfig } from './model';

const config: IConfig = {
    port:  Number(process.env.PORT || '3000'),
    dbUrl:  process.env.MONGODB_URI || '11',
    jwtSecret: process.env.JWT_SECRET || ''
}
export default config;
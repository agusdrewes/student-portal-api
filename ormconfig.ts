import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: ['dist/**/*.entity.js'],   

  migrations: ['dist/migrations/*.js'],

  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',

  ssl: {
    rejectUnauthorized: false,
  },
});

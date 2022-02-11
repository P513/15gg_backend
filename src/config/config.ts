import * as dotenv from 'dotenv';
dotenv.config();

// DB 설정
export const config = {
  "development": {
    "username": process.env.DEV_DB_USERNAME,
    "password": process.env.DEV_DB_PASSWORD,
    "database": process.env.DEV_DB_DBNAME,
    "host": process.env.DEV_DB_HOST,
    "port": parseInt(process.env.DEV_DB_PORT as string, 10),
    "dialect": "mysql",
    "timezone": '+09:00',
  },
  "production": {
    "username": process.env.PROD_DB_USERNAME,
    "password": process.env.PROD_DB_PASSWORD,
    "database": process.env.PROD_DB_DBNAME,
    "host": process.env.PROD_DB_HOST,
    "port": parseInt(process.env.PROD_DB_PORT as string, 10),
    "dialect": "mysql",
    "timezone": '+09:00',
    "logging": false,
  }
}
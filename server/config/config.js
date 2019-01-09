import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

export default {
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
  NODE_ENV: env.NODE_ENV,
  ADMIN_EMAIL: env.ADMIN_EMAIL,
  ADMIN_PASSWORD: env.ADMIN_PASSWORD,
  CLOUDINARY_URL: env.CLOUDINARY_URL,
  CLOUD_NAME: env.CLOUD_NAME,
  API_KEY: env.API_KEY,
  API_SECRET: env.API_SECRET,
};

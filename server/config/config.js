import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

export default {
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
  NODE_ENV: env.NODE_ENV,
  ADMIN_EMAIL: env.ADMIN_EMAIL,
  ADMIN_PASSWORD: env.ADMIN_PASSWORD,
};

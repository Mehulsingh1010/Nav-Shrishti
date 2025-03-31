
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_TrM0KDZ7YlRh@ep-young-breeze-a5jzxf4z-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
  },
});

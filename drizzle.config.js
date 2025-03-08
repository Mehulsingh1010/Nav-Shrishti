
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_vrKlA6ISgJ5a@ep-still-art-a56iic07-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
  },
});

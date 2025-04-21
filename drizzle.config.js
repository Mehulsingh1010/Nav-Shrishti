
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_fBmTFw6vs2Kr@ep-wild-wave-a410rfs4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
  },
});

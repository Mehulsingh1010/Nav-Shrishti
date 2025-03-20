import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Ensure correct path

export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING, { schema });

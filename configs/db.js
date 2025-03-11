import { drizzle } from 'drizzle-orm/neon-http';
// import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('Database connection string is not defined');
}

const client = postgres(connectionString)
export const db = drizzle(client, { schema })


// export const db = drizzle(connectionString);






// Database connection

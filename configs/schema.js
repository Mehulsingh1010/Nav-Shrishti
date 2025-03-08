import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core"

// User schema with all the required fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  referenceId: varchar("reference_id", { length: 6 }).notNull().unique(),
  title: varchar("title", { length: 10 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  surname: varchar("surname", { length: 100 }).notNull(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line_2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// User schema with all the required fields
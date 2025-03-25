/* eslint-disable @typescript-eslint/no-unused-vars */
import { pgTable, serial, varchar, boolean, timestamp, pgEnum, text, integer, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table (existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Auto-incrementing id
  referenceId: varchar("reference_id", { length: 6 }).notNull().unique(), // 6-digit reference ID
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
  role: varchar("role", { length: 20 }).default("user").notNull(), // New 'role' field, default 'user'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  reviews: many(productReviews),
  orders: many(orders),
}))

// Product status enum
export const productStatusEnum = pgEnum("product_status", ["available", "sold_out"])

// Product category enum
export const productCategoryEnum = pgEnum("product_category", [
  "Agriculture",
  "Pesticides",
  "Testing",
  "Seeds",
  "Equipment",
  "Other",
])

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: varchar("product_id", { length: 6 }).notNull().unique(), // 6-digit product ID
  sellerId: integer("seller_id")
    .notNull()
    .references(() => users.id), // Reference to seller
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: productCategoryEnum("category").notNull(),
  price: integer("price").notNull(), // Store price in paise/cents (e.g., ₹1200 = 120000)
  availableUnits: integer("available_units").notNull().default(0),
  status: productStatusEnum("status").notNull().default("available"),
  photoUrl: text("photo_url"), // URL for product image (can be from upload or external URL)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Product relations
export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  reviews: many(productReviews),
  orderItems: many(orderItems),
}))

// Product reviews table
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 star rating
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Product reviews relations
export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}))

// Order status enum
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "completed", "cancelled", "refunded"])

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "authorized", "captured", "failed", "refunded"])

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 10 }).notNull().unique(), // Unique order ID
  userId: integer("user_id")
    .notNull()
    .references(() => users.id), // Reference to buyer
  totalAmount: integer("total_amount").notNull(), // Total amount in paise/cents
  status: orderStatusEnum("status").notNull().default("pending"),
  shippingAddress: jsonb("shipping_address").notNull(), // Store address as JSON
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Order relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payment: one(payments),
}))

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(), // Price at time of purchase
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Order items relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id)
    .unique(), // One payment per order
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }).notNull().unique(),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }).unique(),
  razorpaySignature: varchar("razorpay_signature", { length: 255 }),
  amount: integer("amount").notNull(), // Amount in paise/cents
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentDetails: jsonb("payment_details"), // Additional payment details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Payment relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

export const bankDetails = pgTable("bank_details", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id), // Reference to user
  bankName: varchar("bank_name", { length: 100 }).notNull(),
  accountNumber: varchar("account_number", { length: 20 }).notNull(),
  ifscCode: varchar("ifsc_code", { length: 11 }).notNull(),
  branchName: varchar("branch_name", { length: 100 }).notNull(),
  accountHolderName: varchar("account_holder_name", { length: 100 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 15 }).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Bank details relations
export const bankDetailsRelations = relations(bankDetails, ({ one }) => ({
  user: one(users, {
    fields: [bankDetails.userId],
    references: [users.id],
  }),
}))

// Update user relations to include bank details
export const updatedUsersRelations = relations(users, ({ many, one }) => ({
  products: many(products),
  reviews: many(productReviews),
  orders: many(orders),
  bankDetails: many(bankDetails), // Add this relation
}))
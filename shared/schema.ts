import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  condition: text("condition").notNull(),
  purchasePrice: numeric("purchase_price", { precision: 10, scale: 2 }).notNull(),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  weight: numeric("weight", { precision: 10, scale: 2 }),
  description: text("description"),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  status: text("status").notNull().default("in_stock"),
  buyerName: text("buyer_name"),
  buyerEmail: text("buyer_email"),
  soldDate: timestamp("sold_date"),
  isGiveaway: integer("is_giveaway").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems, {
  purchasePrice: z.coerce.number(),
  sellingPrice: z.coerce.number(),
  quantity: z.coerce.number().int().min(1),
  weight: z.coerce.number().optional(),
  tags: z.array(z.string()).optional(),
  isGiveaway: z.coerce.number().int().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

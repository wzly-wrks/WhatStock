import { type User, type InsertUser, type InventoryItem, type InsertInventoryItem } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Inventory management
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  getAllInventoryItems(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;
  markItemAsSold(id: string, buyerName: string, buyerEmail: string): Promise<InventoryItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private inventoryItems: Map<string, InventoryItem>;

  constructor() {
    this.users = new Map();
    this.inventoryItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Inventory management methods
  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = {
      title: insertItem.title,
      category: insertItem.category,
      condition: insertItem.condition,
      purchasePrice: insertItem.purchasePrice.toString(),
      sellingPrice: insertItem.sellingPrice.toString(),
      quantity: insertItem.quantity ?? 1,
      id,
      status: insertItem.status || "in_stock",
      subCategory: insertItem.subCategory ?? null,
      weight: insertItem.weight != null ? insertItem.weight.toString() : null,
      description: insertItem.description ?? null,
      imageUrl: insertItem.imageUrl ?? null,
      tags: insertItem.tags ?? null,
      buyerName: insertItem.buyerName ?? null,
      buyerEmail: insertItem.buyerEmail ?? null,
      soldDate: insertItem.soldDate ?? null,
      isGiveaway: insertItem.isGiveaway ?? 0,
      createdAt: new Date(),
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  async markItemAsSold(id: string, buyerName: string, buyerEmail: string): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem: InventoryItem = {
      ...item,
      status: "sold",
      buyerName,
      buyerEmail,
      soldDate: new Date(),
    };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }
}

export const storage = new MemStorage();

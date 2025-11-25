import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInventoryItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    const items = await storage.getAllInventoryItems();
    res.json(items);
  });

  app.get("/api/inventory/:id", async (req, res) => {
    const item = await storage.getInventoryItem(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const parsed = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(parsed);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(req.params.id, req.body);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    const deleted = await storage.deleteInventoryItem(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(204).send();
  });

  app.post("/api/inventory/:id/sold", async (req, res) => {
    try {
      const { buyerName, buyerEmail } = req.body;
      if (!buyerName || !buyerEmail) {
        res.status(400).json({ error: "buyerName and buyerEmail are required" });
        return;
      }
      const item = await storage.markItemAsSold(req.params.id, buyerName, buyerEmail);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/inventory/:id/unsold", async (req, res) => {
    try {
      const item = await storage.unmarkItemAsSold(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

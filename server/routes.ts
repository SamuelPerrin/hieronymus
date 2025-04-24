import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { EntityType } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:slug", async (req, res) => {
    try {
      const collection = await storage.getCollectionBySlug(req.params.slug);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:slug", async (req, res) => {
    try {
      const document = await storage.getDocumentBySlug(req.params.slug);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.get("/api/collection/:collectionId/documents", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      if (isNaN(collectionId)) {
        return res.status(400).json({ message: "Invalid collection ID" });
      }
      const documents = await storage.getDocumentsByCollection(collectionId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/people", async (req, res) => {
    try {
      const people = await storage.getPeople();
      res.json(people);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch people" });
    }
  });

  app.get("/api/people/:slug", async (req, res) => {
    try {
      const person = await storage.getPersonBySlug(req.params.slug);
      if (!person) {
        return res.status(404).json({ message: "Person not found" });
      }
      res.json(person);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch person" });
    }
  });

  app.get("/api/places", async (req, res) => {
    try {
      const places = await storage.getPlaces();
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch places" });
    }
  });

  app.get("/api/places/:slug", async (req, res) => {
    try {
      const place = await storage.getPlaceBySlug(req.params.slug);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
      res.json(place);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch place" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:slug", async (req, res) => {
    try {
      const event = await storage.getEventBySlug(req.params.slug);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Related items for any entity
  app.get("/api/:entityType/:slug/related", async (req, res) => {
    try {
      const entityTypeSchema = z.enum(['document', 'person', 'place', 'event', 'collection']);
      const entityType = entityTypeSchema.safeParse(req.params.entityType);
      
      if (!entityType.success) {
        return res.status(400).json({ message: "Invalid entity type" });
      }
      
      const relatedItems = await storage.getRelatedItemsBySlug(
        entityType.data as EntityType, 
        req.params.slug
      );
      
      res.json(relatedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related items" });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim() === '') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.search(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

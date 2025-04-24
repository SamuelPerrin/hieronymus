import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const entityTypeEnum = pgEnum('entity_type', ['document', 'person', 'place', 'event', 'collection']);
export const documentTypeEnum = pgEnum('document_type', ['letter', 'journal', 'memoir', 'official_record', 'newspaper', 'other']);

// Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown content
  date: text("date"), // Historical date in text format
  year: integer("year"), // For sorting/filtering
  type: documentTypeEnum("type").notNull().default('letter'),
  source: text("source"), // Source information
  location: text("location"), // Where the document was created
  archiveReference: text("archive_reference"), // Reference number in archive
  collectionId: integer("collection_id").references(() => collections.id),
  transcribedBy: text("transcribed_by"),
  transcriptionDate: timestamp("transcription_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  tags: text("tags").array(), // Array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  alternateNames: text("alternate_names").array(),
  birthDate: text("birth_date"),
  deathDate: text("death_date"),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  alternateNames: text("alternate_names").array(),
  region: text("region"),
  country: text("country"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relationships between entities
export const relationships = pgTable("relationships", {
  id: serial("id").primaryKey(),
  fromType: entityTypeEnum("from_type").notNull(),
  fromId: integer("from_id").notNull(),
  toType: entityTypeEnum("to_type").notNull(),
  toId: integer("to_id").notNull(),
  relationshipType: text("relationship_type"), // e.g., "author", "recipient", "mentions", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPersonSchema = createInsertSchema(people).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRelationshipSchema = createInsertSchema(relationships).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof people.$inferSelect;

export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type Place = typeof places.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Relationship = typeof relationships.$inferSelect;

// Entity type for unified handling of different entity types
export type EntityType = 'document' | 'person' | 'place' | 'event' | 'collection';

export type Entity = Document | Person | Place | Event | Collection;

export type RelatedItem = {
  id: number;
  type: EntityType;
  name: string;
  slug: string;
  relationshipType?: string;
  description?: string;
  date?: string;
};

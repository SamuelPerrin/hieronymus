// Enums
export enum SourceType {
  letter,
  memo,
  book,
  chapter,
  essay,
  article,
  speech,
  report,
  interview
}

// Types
export type Collection = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  content: string; // Markdown content
  createdAt: Date;
  updatedAt: Date;
};

export type Document = {
  id: number;
  slug: string;
  title: string;
  content: string; // Markdown content
  date?: string; // Historical date in text format
  year?: number; // For sorting/filtering
  type: SourceType; // Document type (letter, book, etc.)
  source?: string; // Source information
  location?: string; // Where the document was created
  archiveReference?: string; // Reference number in archive
  collectionId: number;
  transcribedBy?: string;
  transcriptionDate?: Date;
  lastUpdated?: Date;
  tags?: string[]; // Array of tags
};

export type Person = {
  id: number;
  slug: string;
  name: string;
  alternateNames?: string[];
  birthDate?: string;
  deathDate?: string;
  birthYear?: number;
  deathYear?: number;
  description?: string;
};

export type Place = {
  id: number;
  slug: string;
  name: string;
  alternateNames?: string[];
  region?: string;
  country?: string;
  description?: string;
};

export type Event = {
  id: number;
  slug: string;
  name: string;
  startDate?: string;
  endDate?: string;
  startYear?: number;
  endYear?: number;
  description?: string;
};


// Entity type for unified handling of different entity types
export type EntityType = 'document' | 'person' | 'place' | 'event' | 'collection';

export type EntityTypeSlug = 'documents' | 'people' | 'places' | 'events' | 'collections';

export type Entity = Document | Person | Place | Event | Collection;

export type RelatedItem = {
  id: number;
  type: EntityType;
  name: string;
  slug: string;
  description?: string;
  date?: string;
};

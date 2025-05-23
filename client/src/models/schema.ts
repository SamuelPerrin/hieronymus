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
  source?: string; // Source 
  authors?: string[]; // Authors of the document
  recipients?: string[]; // Recipients of the document (for letters)
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
  city?: string;
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
export enum EntityType {
  document = "document",
  person = "person",
  place = "place",
  event = "event",
  collection = "collection"
};

export enum EntityTypeSlug {
  documents = 'documents',
  people = 'people',
  places = 'places',
  events = 'events',
  collections = 'collections'
};

export const EntityTypeMap: Record<EntityType, EntityTypeSlug> = {
  [EntityType.collection]: EntityTypeSlug.collections,
  [EntityType.document]: EntityTypeSlug.documents,
  [EntityType.event]: EntityTypeSlug.events,
  [EntityType.person]: EntityTypeSlug.people,
  [EntityType.place]: EntityTypeSlug.places
};

export class RelatedItem {
  id: number;
  type: EntityType;
  name: string;
  slug: string;
  description?: string;
  date?: string;
  
  constructor(id: number, type: EntityType, name: string, slug: string, description?: string, date?: string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.date = date;
  }
};

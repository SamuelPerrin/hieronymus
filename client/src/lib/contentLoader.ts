import { Collection, Document, EntityTypeSlug, Event, Person, Place } from "@shared/schema";

// Import all markdown files
const documents = import.meta.glob("../content/documents/*.md", {
  eager: true,
  query: "?raw"
});
const collections = import.meta.glob("../content/collections/*.md", {
  eager: true,
  query: "?raw"
});
const events = import.meta.glob("../content/events/*.md", {
  eager: true,
  query: "?raw"
});
const people = import.meta.glob("../content/people/*.md", {
  eager: true,
  query: "?raw"
});
const places = import.meta.glob("../content/places/*.md", {
  eager: true,
  query: "?raw"
});

function parseMarkdownMetadata(content: string) {
  const lines = content.split("\n");
  const metadata: Record<string, any> = {};
  let contentStart = 0;

  // Find metadata section
  if (lines[0]?.trim() === "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === "---") {
        contentStart = i + 1;
        break;
      }
      const match = lines[i]?.match(/^(\w+):\s*(.*)$/);
      if (match) {
        metadata[match[1]] = match[2];
      }
    }
  }

  const mainContent = lines.slice(contentStart).join("\n");
  return { metadata, content: mainContent };
}

// Get Documents
export function getDocumentBySlug(slug: string): Document | undefined {
  const filePath = `../content/documents/${slug}.md`;
  const file = documents[filePath] as { default: string } | undefined;

  if (!file) return undefined;

  const { metadata, content } = parseMarkdownMetadata(file.default);

  return {
    id: parseInt(metadata.id) || 0,
    slug,
    title: metadata.title || "",
    content,
    date: metadata.date,
    type: metadata.type,
    source: metadata.source,
    location: metadata.location,
    archiveReference: metadata.archiveReference,
    collectionId: parseInt(metadata.collectionId) || 0,
  };
}

export function getAllDocuments(): Document[] {
  return Object.entries(documents).map(([path, content]) => {
    const fileName = path.split("/").pop()?.replace(".md", "") || "";

    // This should match the way slugs are generated in markdownUtils.ts
    const slug = fileName.toLowerCase().replace(/\s+/g, "-");
    return getDocumentBySlug(slug)!;
  });
}

export function getDocumentsLength(): number {
  return Object.keys(documents).length;
}

export function getDocumentsByCollectionId(collectionId: number): Document[] {
  return getAllDocuments().filter(doc => doc.collectionId === collectionId);
}

// Get Collections
export function getCollectionBySlug(slug: string): Collection | undefined {
  const filePath = `../content/collections/${slug}.md`;
  const file = collections[filePath] as { default: string } | undefined;

  if (!file) return undefined;

  const { metadata, content } = parseMarkdownMetadata(file.default);
  return {
    id: parseInt(metadata.id) || 0,
    slug,
    title: metadata.title || "",
    description: metadata.description || "",
    content,
    createdAt: new Date(metadata.createdAt || Date.now()),
    updatedAt: new Date(metadata.updatedAt || Date.now()),
  };
}

export function getAllCollections(): Collection[] {
  return Object.entries(collections).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    return getCollectionBySlug(slug)!;
  });
}

export function getCollectionsLength(): number {
  return Object.keys(collections).length;
}

// Get People
export function getPersonBySlug(slug: string): Person | undefined {
  const filePath = `../content/people/${slug}.md`;
  const file = people[filePath] as { default: string } | undefined;
  
  if (!file) return undefined;

  const { metadata, content } = parseMarkdownMetadata(file.default);
  return {
    id: parseInt(metadata.id) || 0,
    slug,
    name: metadata.name || "",
    alternateNames: metadata.alternateNames || [],
    description: content,
    birthDate: metadata.birthDate,
    deathDate: metadata.deathDate,
    birthYear: metadata.birthYear,
    deathYear: metadata.deathYear,
  };
}

export function getAllPeople(): Person[] {
  return Object.entries(people).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    return getPersonBySlug(slug)!;
  });
}

export function getPeopleLength(): number {
  return Object.keys(people).length;
}

// Get Events
export function getEventBySlug(slug: string): Event | undefined {
  const filePath = `../content/events/${slug}.md`;
  const file = events[filePath] as { default: string } | undefined;
  if (!file) return undefined;
  const { metadata, content } = parseMarkdownMetadata(file.default);
  return {
    id: parseInt(metadata.id) || 0,
    slug,
    name: metadata.name || "",
    description: content,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    startYear: metadata.startYear,
    endYear: metadata.endYear,
  };
}
export function getAllEvents(): Event[] {
  return Object.entries(events).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    return getEventBySlug(slug)!;
  });
}

export function getEventsLength(): number {
  return Object.keys(events).length;
}

// Get Places
export function getPlaceBySlug(slug: string): Place | undefined {
  const filePath = `../content/places/${slug}.md`;
  const file = places[filePath] as { default: string } | undefined;

  
  if (!file) return undefined;
  
  const { metadata, content } = parseMarkdownMetadata(file.default);

  return {
    id: parseInt(metadata.id) || 0,
    slug,
    name: metadata.name || "",
    alternateNames: metadata.alternateNames || [],
    region: metadata.region,
    country: metadata.country,
    description: content,
  };
}

export function getAllPlaces(): Place[] {
  return Object.entries(places).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    return getPlaceBySlug(slug)!;
  });
}

export function getPlacesLength(): number {
  return Object.keys(places).length;
}

// Utils
export function getEntityTypeForSlug(slug: string): EntityTypeSlug | null {
  if (slug) {
    if (documents[`../content/documents/${slug}.md`]) {
      return "documents";
    } else if (collections[`../content/collections/${slug}.md`]) {
      return "collections";
    } else if (people[`../content/people/${slug}.md`]) {
      return "people";
    } else if (events[`../content/events/${slug}.md`]) {
      return "events";
    } else if (places[`../content/places/${slug}.md`]) {
      return "places";
    }
  }

  return null;
}

// Tell TypeScript about .md imports
declare module "*.md" {
  const content: string;
  export default content;
}

import { Collection, Document, Event, Person, Place } from "@shared/schema";

// Import all markdown files
const documents = import.meta.glob("/content/documents/*.md", { eager: true });
const collections = import.meta.glob("/content/collections/*.md", {
  eager: true,
});
const events = import.meta.glob("/content/events/*.md", { eager: true });
const people = import.meta.glob("/content/people/*.md", { eager: true });
const places = import.meta.glob("/content/places/*.md", { eager: true });

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

export function getDocumentBySlug(slug: string): Document | undefined {
  const filePath = `/content/documents/${slug}.md`;
  console.log("File path:", filePath);
  console.log("Documents:", documents);
  const file = documents[filePath] as { default: string } | undefined;
  console.log("File:", file);

  if (!file) return undefined;

  const { metadata, content } = parseMarkdownMetadata(file.default);
  return {
    id: parseInt(metadata.id) || 0,
    slug,
    title: metadata.title || "",
    content,
    date: metadata.date,
    source: metadata.source,
    location: metadata.location,
    archiveReference: metadata.archiveReference,
    collectionId: parseInt(metadata.collectionId) || undefined,
    createdAt: new Date(metadata.createdAt || Date.now()),
    updatedAt: new Date(metadata.updatedAt || Date.now()),
  };
}

export function getAllDocuments(): Document[] {
  return Object.entries(documents).map(([path, content]) => {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    return getDocumentBySlug(slug)!;
  });
}

// Similar functions for other content types...
export function getCollectionBySlug(slug: string): Collection | undefined {
  const filePath = `./content/collections/${slug}.md`;
  const file = collections[filePath] as { default: string } | undefined;

  if (!file) return undefined;

  const { metadata, content } = parseMarkdownMetadata(file.default);
  return {
    id: parseInt(metadata.id) || 0,
    slug,
    title: metadata.title || "",
    description: content,
    createdAt: new Date(metadata.createdAt || Date.now()),
    updatedAt: new Date(metadata.updatedAt || Date.now()),
  };
}

// Add other getter functions as needed

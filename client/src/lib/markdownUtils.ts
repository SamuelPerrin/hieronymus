import { marked } from 'marked';
import { getEntityTypeForSlug } from './contentLoader';

const renderer = new marked.Renderer();

renderer.text = function (text) {
  // Match wiki links in the format [[PageName|DisplayName]]
  // Example: [[PageName|DisplayName]] or [[PageName]]
  const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  return text.raw.replace(pattern, (match, pageName, displayName) => {

    // This should match the way slugs are generated from file names in contentLoader.ts
    const slug = pageName.toLowerCase().replace(/\s+/g, "-");

    // Check if the slug corresponds to a known page and determine the entity type
    const entityType = getEntityTypeForSlug(slug);
    if (!entityType) return displayName || pageName; // If no page/EntityType is found, don't link anything

    return `<a href="/${entityType}/${slug}">${displayName || pageName}</a>`;
  });
};

marked.setOptions({ renderer });

/**
 * Convert Markdown to HTML
 */
export function renderMarkdown(markdown: string): string | Promise<string> {
  if (!markdown || typeof markdown !== 'string') {
    console.error('Invalid markdown content:', markdown);
    return 'Content could not be displayed';
  }
  
  try {
    // Use the simplest approach to parse markdown to HTML
    return marked.parse(markdown);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return 'Error rendering content';
  }
}

/**
 * Extract the first paragraph from markdown for summaries
 */
export function extractExcerpt(markdown: string, maxLength = 150): string {
  // Get the first paragraph
  const firstParagraph = markdown.split('\n\n')[0].replace(/\n/g, ' ').trim();
  
  // Strip markdown syntax
  const plainText = firstParagraph
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*|__/g, '') // Remove bold
    .replace(/\*|_/g, '') // Remove italic
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove wiki links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/`([^`]+)`/g, '$1'); // Remove inline code
  
  // Truncate if necessary
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
}

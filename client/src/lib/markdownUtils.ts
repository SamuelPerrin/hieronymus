import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true
});

// Custom renderer to handle internal links
const renderer = new marked.Renderer();

// Override the default link renderer to add styling
renderer.link = (href, title, text) => {
  const isExternal = href?.startsWith('http');
  const className = 'text-highlight hover:underline';
  const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}" title="${title || ''}" class="${className}" ${targetAttr}>${text}</a>`;
};

// Override the default blockquote renderer to match our style
renderer.blockquote = (quote) => {
  return `<blockquote class="border-l-4 pl-4 italic my-6 text-accent-700 dark:text-primary-300">${quote}</blockquote>`;
};

// Override the default paragraph renderer for styling
renderer.paragraph = (text) => {
  return `<p class="mb-4">${text}</p>`;
};

/**
 * Convert Markdown to HTML
 */
export function renderMarkdown(markdown: string): string {
  return marked(markdown, { renderer });
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

import { marked } from 'marked';
import { getEntityTypeForSlug } from './contentLoader';
import parse from 'html-react-parser';
import React from 'react';
import Link  from '@/components/ui/link';

const renderer = new marked.Renderer();

// Override the default text renderer to handle wiki links
renderer.text = function (text) {
  // Match wiki links in the format [[PageName|DisplayName]]
  // Example: [[PageName|DisplayName]] or [[PageName]]
  const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  return text.raw.replace(pattern, (match, pageName, displayName) => {
    // This should match the way slugs are generated from file names in contentLoader's getAllDocuments
    const slug = pageName.toLowerCase().replace(/\s+/g, "-");

    // Check if the slug corresponds to a known page and determine the entity type
    const entityType = getEntityTypeForSlug(slug);
    if (!entityType) return displayName || pageName; // If no page/EntityType is found, don't link anything

    return `<a href="/${entityType}/${slug}">${displayName || pageName}</a>`;
  });
};

// Override the default link renderer to handle external links
renderer.link = function({href, title, text}) {
  const isExternal = /^https?:\/\//.test(href);
  return `<a href="${isExternal ? href : '/' + href}" target="${isExternal ? '_blank' : '_self'}">${text}</a>`;
};

// Override the default list renderer to ensure that links in lists are parsed correctly
renderer.listitem = function({ text, task, checked }) {
  const tokens = marked.lexer(text); // Tokenize the Markdown
  const parsedText = marked.parser(tokens); // Parse without auto-wrapping in <p>
  return `<li>${parsedText}</li>`;
};

// Don't let consecutive blockquote paragraphs be run into one
renderer.blockquote = (quote) => {
  let output = "<blockquote>";
  const lines = quote.raw.split('\n');
  let inOrderedList = false;
  let inUnorderedList = false;
  lines.forEach(line => {
    // Remove leading '>' and trim whitespace
    const trimmedLine = line.replace(/^>\s*/, '');

    // Handle ordered lists (lines starting with "1.", "2.", etc.)
    if (/^\d+\.\s/.test(trimmedLine)) {
        if (!inOrderedList) {
            output += "<ol>"; // Start ordered list if not already in one
            inOrderedList = true;
        }
        output += `<li>${marked.parseInline(trimmedLine)}</li>`;
        return;
    } else if (inOrderedList) {
        output += "</ol>"; // Close ordered list
        inOrderedList = false;
    }

    // Handle unordered lists (lines starting with "-", "*", etc.)
    if (/^[*-]\s/.test(trimmedLine)) {
        if (!inUnorderedList) {
            output += "<ul>"; // Start unordered list if not already in one
            inUnorderedList = true;
        }
        output += `<li>${marked.parseInline(trimmedLine.replace(/^[*-]\s/, ''))}</li>`;
        return;
    } else if (inUnorderedList) {
        output += "</ul>"; // Close unordered list
        inUnorderedList = false;
    }

    // Handle headings
    if (/^(#{1,6})\s+(.*)$/.test(trimmedLine)) {
      const headingLevel = trimmedLine.match(/^(#{1,6})/)![0].length; // Get the number of #
      const headingText = trimmedLine.replace(/^#{1,6}\s+/, ''); // Extract heading text
      output += `<h${headingLevel}>${marked.parseInline(headingText)}</h${headingLevel}>`;
      return;
    }

    // Handle indentation
    if (/^>(\t|\s\s)/.test(line)) {
      output += `<p class="ml-4">${marked.parseInline(trimmedLine)}</p>`;
      return;
    }

    if (!trimmedLine) {
      output += "<br/>"; // Add a line break for empty lines
      return;
    }
    // Default case: treat as paragraph
    output += `<p class="no-mb">${marked.parseInline(trimmedLine)}</p>`;
  });

  // Close any remaining lists
  if (inOrderedList) output += "</ol>";
  if (inUnorderedList) output += "</ul>";

  output += "</blockquote>\n";
  return output;
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
    let adjustedMarkdown = adjustMarkdown(markdown);
    // Use the simplest approach to parse markdown to HTML
    return marked.parse(adjustedMarkdown);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return 'Error rendering content';
  }
}

/**
 * Adjust the raw markdown string before parsing
 */
function adjustMarkdown(markdown: string): string {
  return adjustEscaping(adjustIndentation(markdown));
}

/**
 * Adjust the escaping of brackets in the markdown
 * This is a workaround for the fact that the markdown parser
 * doesn't treat `\[*sic*\]` the way we want.
 */
function adjustEscaping(markdown: string): string {
  // Replace `\[*sic*\]` with `[*sic*]`
  markdown = markdown.replace(/\\\[/g, "[");
  markdown = markdown.replace(/\\\]/g, "]");
  return markdown;
}

/**
 * Double the number of spaces in the indentation of lists
 * This is a workaround for the fact that the markdown parser
 * expects four spaces per level of indentation rather than two.
 */
function adjustIndentation(markdown: string): string {
  return markdown.replace(/^(\s{2,})(\*|-|\d+\.)/gm, (_, spaces, bullet) => ' '.repeat(spaces.length * 2) + bullet);
}


/**
 * Convert HTML to JSX
 */
export function prepareJSX(markdown: string): React.JSX.Element {
  let html = renderMarkdown(markdown);
  if (typeof html == 'string') {
    return <>{parse(html, { replace: transform})}</>
  }
  return <p className="text-red-500">There was an error rendering this document.</p>
}

/**
 * Helper for parsing HTML anchor tags to wouter Links
 */
const transform = (node: any): React.JSX.Element => {
  if (node.type === "tag" && node.name === "a") {
    const href = node.attribs.href;
    return <Link to={href} target={node.attribs.target}>{node.children.map((child: {type: string; data?: string}) => child.type === "text" ? child.data : "")}</Link>
  }
  return node;
}

/**
 * Extract the first paragraph from markdown for summaries
 */
export function extractExcerpt(markdown: string, maxLength = 150): string {
  const MINIMUM_LENGTH = 20; // characters

  // Get the first real paragraph (avoid dates, salutations, addresses, etc.)
  const paragraphs = markdown.split('\n');
  let firstParagraph = paragraphs.find(p => p.length > MINIMUM_LENGTH)?.replace(/\n/g, ' ').trim();
  if (!firstParagraph) {
    firstParagraph = paragraphs[0].replace(/\n/g, ' ').trim();
  }
  
  // Strip markdown syntax
  const plainText = firstParagraph
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*|__/g, '') // Remove bold
    .replace(/\*|_/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/\[\[([^\[\]]+?)\|([^\]]+)\]\]/g, '$2') // Remove wiki links with display names
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove wiki links
    .replace(/`([^`]+)`/g, '$1'); // Remove inline code
  
  // Truncate if necessary
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
}

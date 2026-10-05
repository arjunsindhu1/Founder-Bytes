import { ArticleBlock } from '../types/cms';

/**
 * Escapes raw text for safe HTML embedding
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts legacy/modular ArticleBlock array into a unified rich-text HTML string.
 */
export function convertBlocksToArticleBody(blocks: ArticleBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  // Sort blocks by position
  const sorted = [...blocks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  // If there is already an 'article_body' block, return its content directly
  const unifiedBlock = sorted.find((b) => b.block_type === ('article_body' as any) || b.block_type === ('rich_text' as any));
  if (unifiedBlock && unifiedBlock.content && unifiedBlock.content.trim().length > 0) {
    return unifiedBlock.content;
  }

  const htmlParts: string[] = [];

  for (const block of sorted) {
    if (block.block_type === ('seo_metadata' as any)) {
      continue;
    }

    if (block.block_type === 'heading') {
      htmlParts.push(`<h2>${escapeHtml(block.content)}</h2>`);
    } else if (block.block_type === 'subheading') {
      htmlParts.push(`<h3>${escapeHtml(block.content)}</h3>`);
    } else if (block.block_type === 'paragraph') {
      // Check if content already contains HTML tags
      const trimmed = block.content?.trim() || '';
      if (trimmed.startsWith('<p>') || trimmed.startsWith('<h') || trimmed.startsWith('<div')) {
        htmlParts.push(trimmed);
      } else if (trimmed.length > 0) {
        htmlParts.push(`<p>${trimmed}</p>`);
      }
    } else if (block.block_type === 'quote') {
      const cite = block.attribution ? `<cite>— ${escapeHtml(block.attribution)}</cite>` : '';
      htmlParts.push(`<blockquote><p>${escapeHtml(block.content)}</p>${cite}</blockquote>`);
    } else if (block.block_type === 'image') {
      const alt = block.image_alt ? escapeHtml(block.image_alt) : '';
      const caption = block.image_caption ? escapeHtml(block.image_caption) : '';
      const credit = block.image_credit ? `<span class="image-credit">Photo: ${escapeHtml(block.image_credit)}</span>` : '';
      const captionTag = (caption || credit) ? `<figcaption>${caption}${caption && credit ? ' ' : ''}${credit}</figcaption>` : '';
      htmlParts.push(`<figure><img src="${block.image_url}" alt="${alt}" />${captionTag}</figure>`);
    } else if (block.block_type === 'divider') {
      htmlParts.push('<hr />');
    } else if (block.block_type === 'list') {
      const items = (block.content || '').split('\n').filter(Boolean);
      htmlParts.push(`<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`);
    } else if (block.content) {
      htmlParts.push(`<p>${block.content}</p>`);
    }
  }

  return htmlParts.join('\n');
}

/**
 * Extracts plain text from an HTML string
 */
export function extractPlainTextFromHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates word count from HTML or plain text
 */
export function countWords(content: string): number {
  const text = extractPlainTextFromHtml(content);
  if (!text) return 0;
  const words = text.match(/\b[a-zA-Z0-9_\u0900-\u097F'-]+\b/g);
  return words ? words.length : 0;
}

/**
 * Calculates estimated reading time in minutes (approx 200 wpm)
 */
export function calculateReadingTime(content: string): number {
  const words = countWords(content);
  return Math.max(1, Math.ceil(words / 200));
}

export interface HeadingItem {
  level: number; // 2, 3, 4
  text: string;
  id: string;
}

/**
 * Analyzes HTML headings structure (H2, H3, H4) and checks for hierarchy issues
 */
export function analyzeHeadings(html: string): {
  headings: HeadingItem[];
  hasH1InBody: boolean;
  hierarchyIssues: string[];
} {
  const headings: HeadingItem[] = [];
  const hierarchyIssues: string[] = [];
  let hasH1InBody = false;

  if (!html) {
    return { headings, hasH1InBody, hierarchyIssues };
  }

  // Regex to match h1-h6 tags
  const headingRegex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  let prevLevel = 1; // H1 is the article title

  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const level = parseInt(tag.charAt(1), 10);
    const text = extractPlainTextFromHtml(match[2]);

    if (level === 1) {
      hasH1InBody = true;
      hierarchyIssues.push('Body contains an H1 tag. The article headline is already H1; use H2 for major sections.');
    } else if (level - prevLevel > 1) {
      hierarchyIssues.push(`Skipped heading level: H${prevLevel} jumped directly to H${level} ("${text.slice(0, 30)}...") without H${prevLevel + 1}.`);
    }

    headings.push({
      level,
      text,
      id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });

    prevLevel = level;
  }

  return { headings, hasH1InBody, hierarchyIssues };
}

/**
 * Validates standard UUID format (8-4-4-4-12 hex characters)
 */
export function isValidUUID(str: any): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

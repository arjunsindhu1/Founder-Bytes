import { Article } from '../types';

export function updatePageSEO(options: {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  section?: string;
}) {
  if (typeof document === 'undefined') return;

  const siteName = 'Founder Bytes';
  const defaultTitle = 'FOUNDER BYTES — India’s Business & Startup Magazine';
  const defaultDesc =
    'India’s premier digital business, startup news, and founder intelligence publication. In-depth reporting on venture capital, innovation, and Indian enterprise.';
  const defaultImage = 'https://founderbytes.in/logo.png';
  const defaultCanonical = 'https://founderbytes.in/';

  const fullTitle = options.title ? `${options.title} — ${siteName}` : defaultTitle;
  const description = options.description || defaultDesc;
  const canonical = options.canonicalUrl || defaultCanonical;
  const type = options.type || 'website';
  const image = options.image || defaultImage;
  const imageAlt = options.imageAlt || options.title || siteName;

  // 1. Title
  document.title = fullTitle;

  // 2. Helper to set or create meta tag
  const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
    const selector = isProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', value);
  };

  // 3. Helper for link tag (canonical)
  const setLink = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  // Standard Meta
  setMeta('description', description);
  setLink('canonical', canonical);

  // Open Graph
  setMeta('og:site_name', siteName, true);
  setMeta('og:type', type, true);
  setMeta('og:title', options.title || fullTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonical, true);
  setMeta('og:image', image, true);
  setMeta('og:image:alt', imageAlt, true);
  setMeta('og:locale', 'en_IN', true);

  if (type === 'article') {
    if (options.publishedTime) {
      setMeta('article:published_time', options.publishedTime, true);
    }
    if (options.modifiedTime || options.publishedTime) {
      setMeta('article:modified_time', options.modifiedTime || options.publishedTime || '', true);
    }
    if (options.authorName) {
      setMeta('article:author', options.authorName, true);
    }
    if (options.section) {
      setMeta('article:section', options.section, true);
    }
  }

  // Twitter / X Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:site', '@founderbytes');
  setMeta('twitter:title', options.title || fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);
  setMeta('twitter:image:alt', imageAlt);
}

export function updateArticleSEO(article: Article) {
  const canonicalUrl = `https://founderbytes.in/${article.slug}`;
  updatePageSEO({
    title: article.title,
    description: article.dek,
    canonicalUrl,
    type: 'article',
    image: article.featuredImage,
    imageAlt: article.title,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt || article.publishedAt,
    authorName: article.author.name,
    section: article.category,
  });
}

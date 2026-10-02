import React, { useEffect } from 'react';
import { Article } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  article?: Article | null;
  type?: 'website' | 'article';
}

const DEFAULT_TITLE = 'FOUNDER BYTES — India’s Business & Startup Magazine';
const DEFAULT_DESC =
  'India’s premier digital business, startup news, and founder intelligence publication. In-depth reporting on venture capital, innovation, and Indian enterprise.';
const SITE_NAME = 'Founder Bytes';
const BASE_URL = 'https://founderbytes.in';
const DEFAULT_IMAGE = 'https://founderbytes.in/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  article,
  type = 'website',
}) => {
  const pageTitle = article ? `${article.title} — ${SITE_NAME}` : title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const pageDescription = article ? article.dek : description || DEFAULT_DESC;
  const pageCanonical = canonicalUrl || (article ? `${BASE_URL}/${article.slug}` : BASE_URL);
  const pageImage = article?.featuredImage || DEFAULT_IMAGE;
  const pageImageAlt = article?.imageCaption || article?.title || SITE_NAME;
  const isArticle = type === 'article' || Boolean(article);

  useEffect(() => {
    // 1. Title
    document.title = pageTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta & Favicons
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setLinkTag('canonical', pageCanonical);
    setLinkTag('icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');
    setLinkTag('shortcut icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');
    setLinkTag('apple-touch-icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');

    // 3. Open Graph (WhatsApp, LinkedIn, Facebook, Slack)
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:url', pageCanonical);
    setMetaTag('property', 'og:type', isArticle ? 'article' : 'website');
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:image:secure_url', pageImage);
    setMetaTag('property', 'og:image:alt', pageImageAlt);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    if (article) {
      setMetaTag('property', 'article:published_time', article.publishedAt);
      setMetaTag('property', 'article:modified_time', article.updatedAt || article.publishedAt);
      setMetaTag('property', 'article:author', article.author.name);
      setMetaTag('property', 'article:section', article.category);
    }

    // 4. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@founderbytes');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);
    setMetaTag('name', 'twitter:image:alt', pageImageAlt);

    // 5. JSON-LD Dynamic Schema
    let scriptTag = document.getElementById('fb-dynamic-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'fb-dynamic-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (article) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': article.isSponsored ? 'Article' : 'NewsArticle',
        headline: article.title,
        description: article.dek,
        image: [article.featuredImage],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        inLanguage: 'en-IN',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageCanonical,
        },
        author: [
          {
            '@type': 'Person',
            name: article.author.name,
            url: `${BASE_URL}/author/${article.author.slug}`,
            jobTitle: article.author.role,
          },
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: SITE_NAME,
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png`,
            width: 512,
            height: 512,
          },
        },
        articleSection: article.category,
        keywords: article.tags?.join(', ') || article.category,
      };
      scriptTag.textContent = JSON.stringify(schemaData);
    } else {
      const schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'NewsMediaOrganization',
            '@id': `${BASE_URL}/#organization`,
            name: SITE_NAME,
            alternateName: 'The Founder Magazine',
            url: BASE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${BASE_URL}/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png`,
              width: 512,
              height: 512,
            },
            publishingPrinciples: `${BASE_URL}/editorial-policy`,
            correctionsPolicy: `${BASE_URL}/corrections-policy`,
            ethicsPolicy: `${BASE_URL}/ethics-policy`,
            actionableFeedbackPolicy: `${BASE_URL}/contact`,
            foundingDate: '2024',
            sameAs: [
              'https://twitter.com/founderbytes',
              'https://linkedin.com/company/founderbytes',
              'https://instagram.com/founderbytes',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: SITE_NAME,
            publisher: {
              '@id': `${BASE_URL}/#organization`,
            },
          },
        ],
      };
      scriptTag.textContent = JSON.stringify(schemaData);
    }
  }, [pageTitle, pageDescription, pageCanonical, pageImage, pageImageAlt, isArticle, article]);

  return null;
};

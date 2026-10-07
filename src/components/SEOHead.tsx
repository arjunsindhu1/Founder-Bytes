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
const DEFAULT_IMAGE = 'https://founderbytes.in/founder-bytes-og.png';
const BRAND_LOGO = 'https://founderbytes.in/logo.png';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  article,
  type = 'website',
}) => {
  const pageTitle = article?.seoTitle || (article ? `${article.title} — ${SITE_NAME}` : title ? (title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} — ${SITE_NAME}`) : DEFAULT_TITLE);
  const pageDescription = article?.seoDescription || (article ? article.dek : description || DEFAULT_DESC);
  const pageCanonical = article?.canonicalUrl || canonicalUrl || (article ? `${BASE_URL}/${article.slug}` : BASE_URL);
  const pageImage = article?.ogImage || article?.featuredImage || DEFAULT_IMAGE;
  const pageImageAlt = article?.featuredImageAlt || article?.imageCaption || article?.title || SITE_NAME;
  const pageRobots = article?.robotsMeta || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const isArticle = type === 'article' || Boolean(article);

  const ogTitle = article?.ogTitle || pageTitle;
  const ogDescription = article?.ogDescription || pageDescription;
  const ogImage = article?.ogImage || pageImage;

  const twitterTitle = article?.twitterTitle || pageTitle;
  const twitterDescription = article?.twitterDescription || pageDescription;
  const twitterImage = article?.twitterImage || pageImage;

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
    setMetaTag('name', 'robots', pageRobots);
    setLinkTag('canonical', pageCanonical);
    setLinkTag('icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');
    setLinkTag('shortcut icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');
    setLinkTag('apple-touch-icon', '/8051754E-BE89-46BC-8C1F-E63D6C8C856F.png');

    // 3. Open Graph (WhatsApp, LinkedIn, Facebook, Slack)
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDescription);
    setMetaTag('property', 'og:url', pageCanonical);
    setMetaTag('property', 'og:type', isArticle ? 'article' : 'website');
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:secure_url', ogImage);
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
    setMetaTag('name', 'twitter:title', twitterTitle);
    setMetaTag('name', 'twitter:description', twitterDescription);
    setMetaTag('name', 'twitter:image', twitterImage);
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
      const keywordsList = [
        ...(article.focusKeyword ? [article.focusKeyword] : []),
        ...(article.secondaryKeywords || []),
        ...(article.tags || []),
      ];

      const schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': article.schemaType || (article.isSponsored ? 'Article' : 'NewsArticle'),
            headline: article.seoTitle || article.title,
            description: article.seoDescription || article.dek,
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
                url: BRAND_LOGO,
                width: 800,
                height: 800,
              },
            },
            articleSection: article.category,
            keywords: keywordsList.length > 0 ? keywordsList.join(', ') : article.category,
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: BASE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: article.category,
                item: `${BASE_URL}/${article.categorySlug || 'tech'}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: pageCanonical,
              },
            ],
          },
        ],
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
              url: BRAND_LOGO,
              width: 800,
              height: 800,
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

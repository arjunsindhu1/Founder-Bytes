import React, { useState } from 'react';
import { Article } from '../types';
import { formatISTDateTime, getRelativeTime } from '../utils/dateUtils';
import { ArticleCard } from './ArticleCard';
import { NewsletterBox } from './NewsletterBox';
import { AdSlot } from './AdSlot';
import { SEOHead } from './SEOHead';
import { 
  Share2, 
  Check, 
  Clock, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft,
  Quote,
  Flame
} from 'lucide-react';

interface ArticlePageProps {
  article: Article;
  allArticles?: Article[];
  onNavigateBack: () => void;
  onSelectArticle: (slug: string) => void;
  onSelectAuthor: (authorSlug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  allArticles = [],
  onNavigateBack,
  onSelectArticle,
  onSelectAuthor,
  onSelectCategory,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const fullUrl = `https://founderbytes.in/${article.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title}\n\nRead more on Founder Bytes: ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`${article.title} via @founderbytes`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const categoryMatches = allArticles.filter((a) => a.id !== article.id && a.categorySlug === article.categorySlug);
  const otherStories = allArticles.filter((a) => a.id !== article.id);
  const relatedArticles = categoryMatches.length > 0 ? categoryMatches.slice(0, 3) : otherStories.slice(0, 3);
  const trendingArticles = allArticles.filter((a) => a.isTrending && a.id !== article.id).slice(0, 4);

  return (
    <article className="w-full bg-white pb-16">
      <SEOHead article={article} type="article" />

      {/* Schema.org NewsArticle Structured Data for SEO / Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': article.isSponsored ? 'Article' : 'NewsArticle',
            headline: article.title,
            description: article.dek,
            image: [article.featuredImage],
            datePublished: article.publishedAt,
            dateModified: article.updatedAt || article.publishedAt,
            author: [
              {
                '@type': 'Person',
                name: article.author.name,
                url: `https://founderbytes.in/author/${article.author.slug}`,
                jobTitle: article.author.role,
              },
            ],
            publisher: {
              '@type': 'NewsMediaOrganization',
              name: 'Founder Bytes',
              url: 'https://founderbytes.in',
              logo: {
                '@type': 'ImageObject',
                url: 'https://founderbytes.in/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullUrl,
            },
          }),
        }}
      />

      {/* Top back navigation breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-2 border-b border-neutral-200">
        <div className="flex items-center justify-between text-xs font-mono">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 font-bold uppercase text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Front Page</span>
          </button>

          <div className="flex items-center gap-2 text-neutral-500">
            <span
              onClick={() => onSelectCategory(article.categorySlug)}
              className="text-neutral-900 font-bold hover:underline cursor-pointer uppercase"
            >
              {article.category}
            </span>
            <span>/</span>
            <span>{article.readingTimeMinutes} MIN READ</span>
          </div>
        </div>
      </div>

      {/* Article Header Container (Standard News Headline Structure) */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* Category & Sponsorship Badge */}
        <div className="flex items-center gap-3 mb-2 font-mono">
          <button
            onClick={() => onSelectCategory(article.categorySlug)}
            className="text-xs font-black uppercase tracking-wider text-neutral-900 hover:text-[#DF9E00] transition-colors inline-flex items-center gap-1.5"
          >
            <span className="w-2 h-2 bg-[#F5B800]"></span>
            <span>{article.category}</span>
          </button>

          {article.subCategory && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-medium text-neutral-500 uppercase">
                {article.subCategory}
              </span>
            </>
          )}

          {article.isSponsored && (
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase px-2 py-0.5 border border-amber-300">
              SPONSORED CONTENT · {article.sponsorName || 'PARTNER'}
            </span>
          )}
        </div>

        {/* H1 Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.14] mb-3">
          {article.title}
        </h1>

        {/* Short Subheadline / Dek */}
        <p className="text-base sm:text-lg text-neutral-600 font-serif leading-relaxed mb-4">
          {article.dek}
        </p>

        {/* Byline and Published/Updated Timestamps */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-neutral-300 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">By</span>
            <button
              onClick={() => onSelectAuthor(article.author.slug)}
              className="font-bold text-neutral-900 hover:underline"
            >
              {article.author.name}
            </button>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-600">Founder Bytes</span>
          </div>

          <div className="text-neutral-500 space-y-0.5 sm:text-right text-[11px]">
            <div>Published: {formatISTDateTime(article.publishedAt)}</div>
            {article.updatedAt && (
              <div className="text-neutral-700 font-semibold">
                Updated: {formatISTDateTime(article.updatedAt)}
              </div>
            )}
          </div>
        </div>

        {/* Social Sharing Strip */}
        <div className="flex items-center justify-between gap-2 py-2 border-b border-neutral-200 text-xs font-mono">
          <span className="text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Story</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1 font-semibold bg-neutral-100 hover:bg-[#25D366] hover:text-white transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={handleShareX}
              className="px-2.5 py-1 font-semibold bg-neutral-100 hover:bg-black hover:text-white transition-colors"
            >
              X
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="px-2.5 py-1 font-semibold bg-neutral-100 hover:bg-[#0077b5] hover:text-white transition-colors"
            >
              LinkedIn
            </button>
            <button
              onClick={handleShareFacebook}
              className="px-2.5 py-1 font-semibold bg-neutral-100 hover:bg-[#1877f2] hover:text-white transition-colors"
            >
              Facebook
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 font-semibold bg-neutral-100 hover:bg-neutral-800 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <span>Copy Link</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Feature Layout: Lead Story (70%) + Trending Sidebar (30%) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
          {/* Main Reading Column (8 cols on lg) */}
          <div className="lg:col-span-8">
            {/* Lead Feature Photograph */}
            <figure className="mb-6">
              <div className="w-full aspect-[16/10] bg-neutral-100 overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {(article.imageCaption || article.imageCredit) && (
                <figcaption className="text-xs text-neutral-500 font-serif italic mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>{article.imageCaption}</span>
                  {article.imageCredit && (
                    <span className="font-mono not-italic text-neutral-400 text-[10px]">
                      Photo: {article.imageCredit}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>

            {/* Sponsored Disclosure if applicable */}
            {article.isSponsored && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6 font-mono">
                <span className="font-bold uppercase tracking-wider block mb-1">
                  Commercial Disclosure:
                </span>
                This article is sponsored by {article.sponsorName}. In accordance with Google News and Founder Bytes editorial transparency standards, sponsored content is clearly demarcated from independent news reporting.
              </div>
            )}

            {/* Article Body (700-800px reading measure) */}
            <div className="space-y-5 text-base sm:text-lg text-neutral-800 leading-[1.8] font-sans">
              {article.content.map((paragraph, index) => {
                if (index === 0) {
                  return (
                    <p key={index} className="editorial-dropcap leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* In-Article Advertisement Placement (Requirement 14) */}
            <AdSlot pageType="article" placement="article-middle" />

            {/* Pull Quote */}
            {article.pullQuote && (
              <div className="my-8 py-5 px-6 border-y-2 border-neutral-900 bg-neutral-50">
                <Quote className="w-6 h-6 text-[#F5B800] mb-1" />
                <blockquote className="text-lg sm:text-xl font-serif font-bold text-neutral-900 leading-snug">
                  &ldquo;{article.pullQuote.text}&rdquo;
                </blockquote>
                <cite className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mt-2 not-italic">
                  — {article.pullQuote.attribution}
                </cite>
              </div>
            )}

            {/* Sources & Verification Notice */}
            <div className="mt-8 p-4 bg-neutral-50 border border-neutral-300">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#DF9E00]" />
                <span>Sources & Editorial Attribution</span>
              </div>
              <p className="text-xs text-neutral-600 mb-2 leading-relaxed font-sans">
                Founder Bytes reporting is corroborated by primary filings, exchange records, or direct interviews:
              </p>
              <ul className="space-y-1 text-xs text-neutral-800 font-mono">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                    <span className="font-semibold">{src.name}</span>
                    <span className="text-neutral-400 text-[10px]">
                      ({src.type === 'original' ? 'Original Reporting' : src.type.toUpperCase()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author Bio Box */}
            <div className="mt-8 p-4 bg-neutral-100 border border-neutral-300 flex items-start gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-400 shrink-0"
              />
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  {article.author.name}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  {article.author.role} · Founder Bytes
                </div>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Trending & Quick Wire (4 cols on lg) */}
          <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-300 pt-6 lg:pt-0 lg:pl-6 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 pb-2 mb-3 border-b-2 border-neutral-900">
                <Flame className="w-4 h-4 text-[#DF9E00]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 font-mono">
                  TRENDING TODAY
                </h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {trendingArticles.map((trend, i) => (
                  <div
                    key={trend.id}
                    onClick={() => onSelectArticle(trend.slug)}
                    className="py-3 first:pt-0 cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-lg font-black text-neutral-300 group-hover:text-[#F5B800] tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                          {trend.category}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug">
                          {trend.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Callout in Sidebar */}
            <div className="p-4 bg-[#111111] text-white">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5B800] font-bold">
                EXECUTIVE BRIEFING
              </div>
              <h4 className="text-sm font-bold mt-1">Get India's daily business intelligence</h4>
              <p className="text-xs text-neutral-400 mt-1">Direct to your inbox at 8:00 AM IST.</p>
              <button
                onClick={() => {
                  const el = document.getElementById('newsletter-box');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-3 py-2 bg-[#F5B800] hover:bg-[#E0A700] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Subscribe Free
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mid-Article Newsletter Box */}
      <div id="newsletter-box" className="mt-12">
        <NewsletterBox />
      </div>

      {/* Related Stories Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t-2 border-neutral-900">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 font-mono">
            RELATED EDITORIAL STORIES
          </h3>
          <span className="text-xs font-mono text-neutral-400">MORE COVERAGE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <ArticleCard
              key={rel.id}
              article={rel}
              variant="secondary"
              onSelectArticle={onSelectArticle}
              onSelectCategory={onSelectCategory}
              onSelectAuthor={onSelectAuthor}
            />
          ))}
        </div>
      </section>
    </article>
  );
};

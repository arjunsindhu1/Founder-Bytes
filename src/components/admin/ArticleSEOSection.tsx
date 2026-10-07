import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Globe, 
  Share2, 
  Code, 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  X, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy
} from 'lucide-react';
import { CMSArticle } from '../../types/cms';
import { calculateSEOScore, SEOAnalysis } from '../../utils/seoScorer';

interface ArticleSEOSectionProps {
  article: CMSArticle;
  onChange: (updated: Partial<CMSArticle>) => void;
  allArticles: CMSArticle[];
}

export const ArticleSEOSection: React.FC<ArticleSEOSectionProps> = ({
  article,
  onChange,
  allArticles = [],
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'google' | 'facebook' | 'twitter' | 'jsonld'>('google');
  const [newSecondaryKeyword, setNewSecondaryKeyword] = useState('');
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  // Compute live SEO score
  const analysis: SEOAnalysis = calculateSEOScore({
    title: article.title,
    seoTitle: article.seo_title,
    metaDescription: article.seo_description,
    focusKeyword: article.focus_keyword,
    secondaryKeywords: article.secondary_keywords,
    canonicalUrl: article.canonical_url || `https://founderbytes.in/${article.slug}`,
    articleBody: article.article_body || article.raw_paragraphs?.join(' ') || '',
    featuredImage: article.featured_image,
    featuredImageAlt: article.featured_image_alt,
    authorId: article.author_id,
    categorySlug: article.category_slug,
  });

  // Suggest SEO Title
  const handleSuggestTitle = () => {
    if (!article.title) return;
    const cleanTitle = article.title.replace(/\s+/g, ' ').trim();
    const suggested = cleanTitle.length > 55 ? `${cleanTitle.slice(0, 52)}...` : cleanTitle;
    onChange({ seo_title: `${suggested} | Founder Bytes` });
  };

  // Suggest Meta Description
  const handleSuggestDescription = () => {
    if (article.subtitle) {
      const clean = article.subtitle.replace(/\s+/g, ' ').trim();
      const desc = clean.length > 155 ? `${clean.slice(0, 152)}...` : clean;
      onChange({ seo_description: desc });
    } else if (article.title) {
      onChange({ seo_description: `${article.title}. In-depth reporting and verified analysis from Founder Bytes newsroom.` });
    }
  };

  // Add Secondary Keyword
  const handleAddSecondaryKeyword = () => {
    const trimmed = newSecondaryKeyword.trim();
    if (!trimmed) return;
    const current = article.secondary_keywords || [];
    if (!current.includes(trimmed)) {
      onChange({ secondary_keywords: [...current, trimmed] });
    }
    setNewSecondaryKeyword('');
  };

  const handleRemoveSecondaryKeyword = (kwToRemove: string) => {
    const current = article.secondary_keywords || [];
    onChange({ secondary_keywords: current.filter((k) => k !== kwToRemove) });
  };

  // Auto-generate slug from headline
  const handleGenerateSlug = () => {
    if (!article.title) return;
    const clean = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const prefix = article.category_slug ? `${article.category_slug}/` : 'news/';
    const fullSlug = `${prefix}${clean}`;
    onChange({
      slug: fullSlug,
      canonical_url: `https://founderbytes.in/${fullSlug}`,
    });
  };

  // Check duplicate slug
  const isDuplicateSlug = allArticles.some(
    (a) => a.id !== article.id && a.slug.toLowerCase().trim() === article.slug.toLowerCase().trim()
  );

  // Fallbacks for previews
  const previewTitle = article.seo_title || article.title || 'Headline not entered yet';
  const previewDesc = article.seo_description || article.subtitle || 'Article summary description will appear here in search engine results.';
  const previewUrl = article.canonical_url || `https://founderbytes.in/${article.slug || 'story-slug'}`;
  const previewImage = article.featured_image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';

  // Build JSON-LD structured data
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': article.schema_type || (article.is_sponsored ? 'Article' : 'NewsArticle'),
    headline: article.seo_title || article.title,
    description: article.seo_description || article.subtitle,
    image: [previewImage],
    datePublished: article.published_at || new Date().toISOString(),
    dateModified: article.updated_at || article.published_at || new Date().toISOString(),
    inLanguage: 'en-IN',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': previewUrl,
    },
    author: [
      {
        '@type': 'Person',
        name: article.author_name || 'Arjun Sindhu',
        url: `https://founderbytes.in/author/arjun-sindhu`,
        jobTitle: article.author_role || 'Founder & Editor-in-Chief',
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Founder Bytes',
      url: 'https://founderbytes.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://founderbytes.in/logo.png',
        width: 800,
        height: 800,
      },
    },
    articleSection: article.category_name || 'Startups',
    keywords: [
      ...(article.focus_keyword ? [article.focus_keyword] : []),
      ...(article.secondary_keywords || []),
      ...(article.tags || []),
    ].join(', '),
  };

  const copyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdData, null, 2));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  return (
    <div className="bg-white border border-neutral-300 p-5 space-y-6 font-mono text-xs">
      {/* Header with SEO Score Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F5B800] rounded-full"></span>
            <h2 className="text-base font-black uppercase text-neutral-900 tracking-wider">
              Search Engine Optimization (SEO) & Social Cards
            </h2>
          </div>
          <p className="text-neutral-500 font-sans text-xs mt-0.5">
            Optimize metadata, focus keywords, Open Graph social share cards, and Schema.org structured data.
          </p>
        </div>

        {/* Real-time SEO Score Badge */}
        <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-300 px-4 py-2 rounded-xs">
          <div className="text-right">
            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
              SEO Health Score
            </div>
            <div className="font-bold text-xs">
              <span className={
                analysis.score >= 80 ? 'text-emerald-700' : analysis.score >= 60 ? 'text-amber-700' : 'text-red-700'
              }>
                {analysis.rating}
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 ${
            analysis.score >= 80 ? 'bg-emerald-50 border-emerald-600 text-emerald-800' :
            analysis.score >= 60 ? 'bg-amber-50 border-amber-600 text-amber-800' :
            'bg-red-50 border-red-600 text-red-800'
          }`}>
            {analysis.score}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left (7 cols), Previews on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. SEO Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-neutral-800">
                SEO Title (Search Headline)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSuggestTitle}
                  className="text-[10px] text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-Suggest</span>
                </button>
                <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                  (article.seo_title?.length || 0) >= 50 && (article.seo_title?.length || 0) <= 60
                    ? 'bg-emerald-100 text-emerald-800'
                    : (article.seo_title?.length || 0) > 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {article.seo_title?.length || 0} / 60 chars (Rec. 50–60)
                </span>
              </div>
            </div>
            <input
              type="text"
              value={article.seo_title || ''}
              onChange={(e) => onChange({ seo_title: e.target.value })}
              placeholder={article.title || 'Enter search-optimized headline (e.g. Gravity Raises $15M Led by 3one4 Capital)'}
              className="w-full px-3 py-2 border border-neutral-300 text-xs font-sans focus:outline-none focus:border-black"
            />
          </div>

          {/* 2. Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-neutral-800">
                Meta Description (Search Snippet)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSuggestDescription}
                  className="text-[10px] text-blue-700 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-Suggest</span>
                </button>
                <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-bold ${
                  (article.seo_description?.length || 0) >= 140 && (article.seo_description?.length || 0) <= 160
                    ? 'bg-emerald-100 text-emerald-800'
                    : (article.seo_description?.length || 0) > 160
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {article.seo_description?.length || 0} / 160 chars (Rec. 140–160)
                </span>
              </div>
            </div>
            <textarea
              rows={3}
              value={article.seo_description || ''}
              onChange={(e) => onChange({ seo_description: e.target.value })}
              placeholder={article.subtitle || 'Short 140-160 character factual synopsis of the article for Google search snippets...'}
              className="w-full px-3 py-2 border border-neutral-300 text-xs font-sans focus:outline-none focus:border-black"
            />
          </div>

          {/* 3. Focus Keyword & Secondary Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Primary Focus Keyword
              </label>
              <input
                type="text"
                value={article.focus_keyword || ''}
                onChange={(e) => onChange({ focus_keyword: e.target.value })}
                placeholder="e.g. Gravity funding"
                className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                The main topical search phrase for this story.
              </span>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Secondary Keywords (Entities)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newSecondaryKeyword}
                  onChange={(e) => setNewSecondaryKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSecondaryKeyword();
                    }
                  }}
                  placeholder="e.g. Saurabh Jain, 3one4 Capital"
                  className="flex-1 px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddSecondaryKeyword}
                  className="px-3 py-2 bg-neutral-900 text-white font-bold hover:bg-black rounded-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Keyword Chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {(article.secondary_keywords || []).map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded-xs text-[10px] text-neutral-800 font-bold"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryKeyword(kw)}
                      className="text-neutral-400 hover:text-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4. SEO Slug & Canonical URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-neutral-800">
                  SEO Slug
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-[10px] text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Regenerate</span>
                </button>
              </div>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => {
                  const clean = e.target.value.toLowerCase().replace(/\s+/g, '-');
                  onChange({
                    slug: clean,
                    canonical_url: `https://founderbytes.in/${clean}`,
                  });
                }}
                className={`w-full px-3 py-2 border text-xs focus:outline-none ${
                  isDuplicateSlug ? 'border-red-600 bg-red-50 text-red-900' : 'border-neutral-300'
                }`}
              />
              {isDuplicateSlug && (
                <p className="text-[10px] text-red-600 font-bold mt-1">
                  ⚠️ Warning: This slug is already used by another article. Please make it unique.
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={article.canonical_url || `https://founderbytes.in/${article.slug}`}
                onChange={(e) => onChange({ canonical_url: e.target.value })}
                placeholder="https://founderbytes.in/..."
                className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* 5. Robots Meta & Schema Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Robots Meta Directive
              </label>
              <select
                value={article.robots_meta || 'index, follow'}
                onChange={(e) => onChange({ robots_meta: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 text-xs bg-white"
              >
                <option value="index, follow">index, follow (Standard Public Story)</option>
                <option value="noindex, follow">noindex, follow (Hide from Google search)</option>
                <option value="index, nofollow">index, nofollow (Index, but ignore links)</option>
                <option value="noindex, nofollow">noindex, nofollow (Private / Embargoed)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1">
                Schema.org Article Type
              </label>
              <select
                value={article.schema_type || (article.is_sponsored ? 'Article' : 'NewsArticle')}
                onChange={(e) => onChange({ schema_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-neutral-300 text-xs bg-white"
              >
                <option value="NewsArticle">NewsArticle (Google News standard reporting)</option>
                <option value="Article">Article (Standard general feature)</option>
              </select>
            </div>
          </div>

          {/* 6. Real-time SEO Checklist Table */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="font-black uppercase text-neutral-800 tracking-wider text-[11px]">
                Editorial SEO Quality Checklist
              </span>
              <span className="text-[10px] text-neutral-500 font-bold">
                {analysis.checks.filter((c) => c.status === 'good').length} / {analysis.checks.length} Passed
              </span>
            </div>

            <div className="divide-y divide-neutral-200/80">
              {analysis.checks.map((chk) => (
                <div key={chk.id} className="py-2 flex items-start gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-white ${
                    chk.status === 'good' ? 'bg-emerald-600' :
                    chk.status === 'improvement' ? 'bg-amber-500' :
                    'bg-red-600'
                  }`}>
                    {chk.status === 'good' ? '✓' : chk.status === 'improvement' ? '!' : '✕'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{chk.label}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {chk.pointsEarned}/{chk.maxPoints} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 font-sans mt-0.5 leading-snug">
                      {chk.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-400 italic pt-2 border-t border-neutral-200">
              Note: Founder Bytes editorial guidelines prioritize natural readability and journalistic rigor over synthetic keyword density.
            </p>
          </div>
        </div>

        {/* Right Column: Live Previews (Google, OpenGraph, Twitter, JSON-LD) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex border-b border-neutral-300 gap-1 pb-1">
            <button
              type="button"
              onClick={() => setActivePreviewTab('google')}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] rounded-xs cursor-pointer ${
                activePreviewTab === 'google' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Google Search
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('facebook')}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] rounded-xs cursor-pointer ${
                activePreviewTab === 'facebook' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Facebook / OG
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('twitter')}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] rounded-xs cursor-pointer ${
                activePreviewTab === 'twitter' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              X / Twitter
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab('jsonld')}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] rounded-xs cursor-pointer ${
                activePreviewTab === 'jsonld' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              JSON-LD
            </button>
          </div>

          {/* TAB 1: GOOGLE SERP PREVIEW */}
          {activePreviewTab === 'google' && (
            <div className="p-4 bg-white border border-neutral-300 rounded-xs shadow-xs space-y-2 font-sans">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <div className="w-5 h-5 rounded-full bg-[#111111] text-[#F5B800] flex items-center justify-center font-bold text-[9px]">
                  FB
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[12px] leading-none text-neutral-900">Founder Bytes</span>
                  <span className="text-[11px] text-neutral-500 truncate max-w-[280px] leading-none font-mono mt-0.5">
                    {previewUrl}
                  </span>
                </div>
              </div>

              {/* Title Link */}
              <h3 className="text-blue-800 hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer line-clamp-2">
                {previewTitle}
              </h3>

              {/* Snippet */}
              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                <span className="font-bold text-neutral-500 mr-1">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —
                </span>
                {previewDesc}
              </p>
            </div>
          )}

          {/* TAB 2: FACEBOOK / OPEN GRAPH PREVIEW */}
          {activePreviewTab === 'facebook' && (
            <div className="space-y-4">
              <div className="border border-neutral-300 bg-white rounded-xs overflow-hidden shadow-xs font-sans">
                <div className="aspect-[1.91/1] w-full bg-neutral-200 overflow-hidden">
                  <img
                    src={article.og_image || previewImage}
                    alt={previewTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-neutral-100 border-t border-neutral-200">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                    FOUNDERBYTES.IN
                  </div>
                  <div className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2 mt-0.5">
                    {article.og_title || previewTitle}
                  </div>
                  <div className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                    {article.og_description || previewDesc}
                  </div>
                </div>
              </div>

              {/* Custom Overrides for OG */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
                <span className="font-bold text-neutral-700 block uppercase text-[10px]">
                  Custom OpenGraph Overrides
                </span>
                <input
                  type="text"
                  value={article.og_title || ''}
                  onChange={(e) => onChange({ og_title: e.target.value })}
                  placeholder="Custom OG Title (leave blank to use SEO Title)"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
                <textarea
                  rows={2}
                  value={article.og_description || ''}
                  onChange={(e) => onChange({ og_description: e.target.value })}
                  placeholder="Custom OG Description (leave blank to use Meta Description)"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
                <input
                  type="url"
                  value={article.og_image || ''}
                  onChange={(e) => onChange({ og_image: e.target.value })}
                  placeholder="Custom OG Image URL (leave blank to use Featured Image)"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: X / TWITTER PREVIEW */}
          {activePreviewTab === 'twitter' && (
            <div className="space-y-4">
              <div className="border border-neutral-300 bg-white rounded-lg overflow-hidden shadow-xs font-sans">
                <div className="aspect-[16/9] w-full bg-neutral-200 overflow-hidden relative">
                  <img
                    src={article.twitter_image || previewImage}
                    alt={previewTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-xs">
                    founderbytes.in
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2">
                    {article.twitter_title || previewTitle}
                  </div>
                  <div className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
                    {article.twitter_description || previewDesc}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-2">
                    founderbytes.in
                  </div>
                </div>
              </div>

              {/* Custom Overrides for Twitter */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
                <span className="font-bold text-neutral-700 block uppercase text-[10px]">
                  Custom Twitter / X Overrides
                </span>
                <input
                  type="text"
                  value={article.twitter_title || ''}
                  onChange={(e) => onChange({ twitter_title: e.target.value })}
                  placeholder="Custom Twitter Title"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
                <textarea
                  rows={2}
                  value={article.twitter_description || ''}
                  onChange={(e) => onChange({ twitter_description: e.target.value })}
                  placeholder="Custom Twitter Description"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
                <input
                  type="url"
                  value={article.twitter_image || ''}
                  onChange={(e) => onChange({ twitter_image: e.target.value })}
                  placeholder="Custom Twitter Image URL"
                  className="w-full px-2 py-1.5 border border-neutral-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: JSON-LD PREVIEW */}
          {activePreviewTab === 'jsonld' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-700 text-[10px] uppercase">
                  Valid Schema.org {article.schema_type || 'NewsArticle'} JSON-LD
                </span>
                <button
                  type="button"
                  onClick={copyJsonLd}
                  className="text-blue-700 hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                >
                  {copiedJsonLd ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedJsonLd ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-neutral-900 text-neutral-200 text-[10px] font-mono rounded-xs overflow-x-auto max-h-[360px] leading-relaxed">
                {JSON.stringify(jsonLdData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

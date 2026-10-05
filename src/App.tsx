import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LatestNewsTicker } from './components/LatestNewsTicker';
import { BreakingNewsBar } from './components/BreakingNewsBar';
import { HeroSection } from './components/HeroSection';
import { LatestAndTrendingSection } from './components/LatestAndTrendingSection';
import { CategorySection } from './components/CategorySection';
import { MagazineShowcase } from './components/MagazineShowcase';
import { NewsletterBox } from './components/NewsletterBox';
import { SearchModal } from './components/SearchModal';
import { ArticlePage } from './components/ArticlePage';
import { MagazinePage } from './components/MagazinePage';
import { AuthorPage } from './components/AuthorPage';
import { PolicyPage, PolicyPageType } from './components/PolicyPage';
import { ArticleCard } from './components/ArticleCard';
import { AdSlot } from './components/AdSlot';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MagazineFlipbook } from './components/MagazineFlipbook';
import { SEOHead } from './components/SEOHead';
import { EditorialLoadingSkeleton } from './components/EditorialLoadingSkeleton';
import { ContentService } from './services/contentService';
import { CMSArticle, CMSSection, CMSMagazineIssue } from './types/cms';
import { Article, MagazineIssue } from './types';
import { DEFAULT_MAGAZINE_ISSUE } from './constants/magazine';

function matchCategory(articleCategorySlug?: string, articleCategoryName?: string, targetCategory?: string): boolean {
  if (!targetCategory || targetCategory === 'all' || targetCategory === 'news' || targetCategory === 'latest') return true;
  const normTarget = targetCategory.toLowerCase().replace(/-news$/, '').trim();
  const aSlug = (articleCategorySlug || '').toLowerCase().trim();
  const aName = (articleCategoryName || '').toLowerCase().trim();

  if (normTarget === 'startups' || normTarget === 'startup') {
    return aSlug === 'startups' || aSlug === 'startup' || aName === 'startups' || aName === 'startup';
  }
  if (normTarget === 'tech' || normTarget === 'technology') {
    return aSlug === 'tech' || aSlug === 'technology' || aName === 'tech' || aName === 'technology';
  }
  if (normTarget === 'business') {
    return aSlug === 'business' || aName === 'business';
  }
  if (normTarget === 'ai' || normTarget === 'artificial intelligence') {
    return aSlug === 'ai' || aName === 'ai';
  }
  if (normTarget === 'funding' || normTarget === 'venture') {
    return aSlug === 'funding' || aName === 'funding';
  }
  if (normTarget === 'founders' || normTarget === 'founder') {
    return aSlug === 'founders' || aName === 'founders';
  }
  if (normTarget === 'innovation') {
    return aSlug === 'innovation' || aName === 'innovation';
  }
  return aSlug === normTarget || aName === normTarget;
}

const DEFAULT_FALLBACK_SECTIONS: CMSSection[] = [
  { id: 'sec-hero', name: 'Top News Lead & Desk Wire', slug: 'main-hero', section_type: 'hero', description: '', display_order: 1, is_visible: true, story_count: 5, layout_type: 'startup-split', created_at: '', updated_at: '' },
  { id: 'sec-wire-trending', name: 'Latest News Wire & Trending Stories', slug: 'latest-trending', section_type: 'wire-trending', description: '', display_order: 2, is_visible: true, story_count: 5, layout_type: 'startup-split', created_at: '', updated_at: '' },
  { id: 'sec-startups', name: 'Startup News & Unit Economics', slug: 'startups', section_type: 'category', category_slug: 'startups', description: '', display_order: 3, is_visible: true, story_count: 4, layout_type: 'startup-split', created_at: '', updated_at: '' },
  { id: 'sec-business', name: 'Business, Banking & Enterprise Economy', slug: 'business', section_type: 'category', category_slug: 'business', description: '', display_order: 4, is_visible: true, story_count: 3, layout_type: 'grid-3', created_at: '', updated_at: '' },
  { id: 'sec-tech', name: 'Technology, Semiconductors & AI', slug: 'tech', section_type: 'category', category_slug: 'tech', description: '', display_order: 5, is_visible: true, story_count: 3, layout_type: 'tech-grid', created_at: '', updated_at: '' },
  { id: 'sec-funding', name: 'Venture Capital & Deal Flow', slug: 'funding', section_type: 'category', category_slug: 'funding', description: '', display_order: 6, is_visible: true, story_count: 3, layout_type: 'funding-table', created_at: '', updated_at: '' },
  { id: 'sec-founders', name: 'Founders & Builders', slug: 'founders', section_type: 'category', category_slug: 'founders', description: '', display_order: 7, is_visible: true, story_count: 3, layout_type: 'founders-mosaic', created_at: '', updated_at: '' },
  { id: 'sec-magazine', name: 'The Founder Magazine Quarterly Showcase', slug: 'the-founder-magazine', section_type: 'magazine', description: '', display_order: 8, is_visible: true, story_count: 1, layout_type: 'horizontal-list', created_at: '', updated_at: '' },
];

// Helper to convert CMSArticle to public Article
function mapCMSArticleToArticle(c: CMSArticle): Article {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    dek: c.subtitle,
    content: c.raw_paragraphs && c.raw_paragraphs.length > 0 ? c.raw_paragraphs : [c.subtitle],
    articleBody: c.article_body,
    category: c.category_name,
    categorySlug: c.category_slug as any,
    subCategory: c.sub_category,
    author: {
      id: c.author_id,
      name: c.author_name,
      slug: c.author_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      role: c.author_role,
      organization: 'Founder Bytes',
      bio: 'Editorial Staff at Founder Bytes',
      avatar: c.author_avatar,
      totalArticles: 1,
    },
    authorId: c.author_id,
    featuredImage: c.featured_image,
    imageCaption: c.image_caption || '',
    imageCredit: c.image_credit || '',
    featuredImageAlt: c.featured_image_alt,
    featuredImageSourceUrl: c.featured_image_source_url,
    publishedAt: c.published_at,
    updatedAt: c.updated_at,
    scheduledAt: c.scheduled_at,
    readingTimeMinutes: c.reading_time_minutes || 4,
    status: (c.status === 'published' ? 'published' : 'draft'),
    tags: c.tags || [],
    sources: c.source_name ? [{ name: c.source_name, url: c.source_url, type: 'original' }] : [{ name: 'Founder Bytes Newsroom', type: 'original' }],
    canonicalUrl: c.canonical_url || `https://founderbytes.in/${c.slug}`,
    seoTitle: c.seo_title,
    seoDescription: c.seo_description,
    focusKeyword: c.focus_keyword,
    secondaryKeywords: c.secondary_keywords,
    robotsMeta: c.robots_meta || 'index, follow',
    ogTitle: c.og_title,
    ogDescription: c.og_description,
    ogImage: c.og_image,
    twitterTitle: c.twitter_title,
    twitterDescription: c.twitter_description,
    twitterImage: c.twitter_image,
    schemaType: c.schema_type,
    sourceType: c.source_type,
    location: c.location,
    articleType: c.article_type,
    entities: c.entities,
    isLeadHero: c.is_featured,
    isSecondaryHero: false,
    isTrending: c.is_trending,
    isEditorPick: c.is_editor_pick,
    pullQuote: c.quote_text ? { text: c.quote_text, attribution: c.quote_author || c.author_name } : undefined,
    isSponsored: c.is_sponsored,
    sponsorName: c.sponsor_name,
  };
}

export default function App() {
  // Navigation / Route state
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'magazine' | 'author' | 'policy' | 'category' | 'admin'>('home');
  const [activeArticleSlug, setActiveArticleSlug] = useState<string>('');
  const [activeAuthorSlug, setActiveAuthorSlug] = useState<string>('');
  const [activePolicyType, setActivePolicyType] = useState<PolicyPageType>('about');
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  
  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Dynamic CMS state initialized from fast cache if available
  const [articles, setArticles] = useState<CMSArticle[]>(() => {
    return ContentService.getCachedArticles() || [];
  });
  const [sections, setSections] = useState<CMSSection[]>(() => {
    return ContentService.getCachedSections() || DEFAULT_FALLBACK_SECTIONS;
  });
  const [magazineIssue, setMagazineIssue] = useState<MagazineIssue>(DEFAULT_MAGAZINE_ISSUE);

  // Explicit loading and error states to prevent false error flashes
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const cached = ContentService.getCachedArticles();
    return !cached || cached.length === 0;
  });
  const [isError, setIsError] = useState<boolean>(false);

  // Load content from dynamic ContentService
  const loadDynamicContent = async (isRetry = false) => {
    if (isRetry || articles.length === 0) {
      setIsLoading(true);
      setIsError(false);
    }

    try {
      const [publishedArticles, activeSections, issues] = await Promise.all([
        ContentService.getArticles({ status: 'published' }),
        ContentService.getSections(),
        ContentService.getMagazineIssues(),
      ]);

      setArticles(publishedArticles);
      if (activeSections && activeSections.length > 0) {
        setSections(activeSections);
      }

      if (issues && issues.length > 0) {
        const topIssue = issues[0];
        setMagazineIssue({
          issueNumber: topIssue.issue_number,
          season: topIssue.season,
          title: topIssue.title,
          dek: topIssue.dek,
          coverImage: topIssue.cover_image,
          coverStorySlug: topIssue.featured_founders[0]?.slug || 'news/latest',
          theme: topIssue.theme,
          publishedDate: topIssue.published_date,
          featuredFounders: topIssue.featured_founders,
          tableOfContents: topIssue.table_of_contents,
        });
      }

      setIsError(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load live Supabase content:', err);
      // Only show error state if we have no articles to display or user explicitly retried
      if (articles.length === 0 || isRetry) {
        setIsError(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDynamicContent();
    const unsubscribe = ContentService.subscribe(() => {
      loadDynamicContent();
    });
    return () => unsubscribe();
  }, []);

  // Parse path on initial load & popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (!path) {
        setCurrentView('home');
        setActiveCategorySlug('');
        return;
      }

      if (path === 'admin') {
        const session = localStorage.getItem('fb_admin_session');
        if (session) {
          setCurrentView('admin');
        } else {
          setCurrentView('home');
          setAdminLoginOpen(true);
        }
        return;
      }

      if (path === 'magazine' || path.startsWith('magazine/')) {
        setCurrentView('magazine');
        return;
      }

      if (path.startsWith('author/')) {
        const authorSlug = path.replace('author/', '');
        setActiveAuthorSlug(authorSlug);
        setCurrentView('author');
        return;
      }

      const policySlugs: PolicyPageType[] = [
        'about',
        'editorial-policy',
        'corrections-policy',
        'ethics-policy',
        'contact',
        'authors',
        'advertise',
        'privacy-policy',
        'terms',
        'cookie-policy',
      ];
      if (policySlugs.includes(path as PolicyPageType)) {
        setActivePolicyType(path as PolicyPageType);
        setCurrentView('policy');
        return;
      }

      // Check article matching slug
      const foundArticle = articles.find((a) => a.slug === path || a.slug.endsWith('/' + path) || path.endsWith('/' + a.slug));
      if (foundArticle) {
        setActiveArticleSlug(foundArticle.slug);
        setCurrentView('article');
        return;
      }

      const validCategories = ['news', 'latest', 'startups', 'business', 'tech', 'technology', 'ai', 'founders', 'funding', 'innovation', 'markets'];
      if (validCategories.includes(path.toLowerCase())) {
        setActiveCategorySlug(path.toLowerCase());
        setCurrentView('category');
        return;
      }

      // Check remote article lookup if direct URL provided
      ContentService.getArticleBySlug(path).then((fetched) => {
        if (fetched) {
          setArticles((prev) => (prev.some((p) => p.slug === fetched.slug) ? prev : [fetched, ...prev]));
          setActiveArticleSlug(fetched.slug);
          setCurrentView('article');
        } else {
          setActiveCategorySlug(path);
          setCurrentView('category');
        }
      });
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [articles]);

  // Sync route and scroll to top
  const navigateTo = (view: 'home' | 'article' | 'magazine' | 'author' | 'policy' | 'category' | 'admin', path: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', `/${path}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slug: string) => {
    setActiveArticleSlug(slug);
    navigateTo('article', slug);
    // Enrich with complete article blocks in background if not already loaded
    ContentService.getArticleBySlug(slug).then((fetched) => {
      if (fetched) {
        setArticles((prev) => prev.map((a) => (a.slug === fetched.slug ? fetched : a)));
      }
    });
  };

  const handleSelectAuthor = (authorSlug: string) => {
    setActiveAuthorSlug(authorSlug);
    navigateTo('author', `author/${authorSlug}`);
  };

  const handleSelectCategory = (categorySlug: string) => {
    if (categorySlug === 'magazine') {
      navigateTo('magazine', 'magazine');
      return;
    }
    setActiveCategorySlug(categorySlug);
    navigateTo('category', categorySlug);
  };

  const handleNavigatePolicy = (policyType: PolicyPageType) => {
    setActivePolicyType(policyType);
    navigateTo('policy', policyType);
  };

  const handleNavigateHome = () => {
    setActiveCategorySlug('');
    navigateTo('home', '');
  };

  const handleNavigateMagazine = () => {
    navigateTo('magazine', 'magazine');
  };

  const handleAdminLoginSuccess = () => {
    setAdminLoginOpen(false);
    navigateTo('admin', 'admin');
  };

  // Convert CMSArticles to mapped Articles
  const mappedArticles = articles.map(mapCMSArticleToArticle);

  // Active article & author
  const currentArticle = mappedArticles.find((a) => a.slug === activeArticleSlug) || mappedArticles[0];
  const currentAuthor = currentArticle?.author;

  // Lead hero resolution
  const featuredArticles = mappedArticles.filter((a) => a.isLeadHero);
  const leadHeroArticle = featuredArticles[0] || mappedArticles[0];
  const nonLeadArticles = mappedArticles.filter((a) => a.id !== leadHeroArticle?.id);
  const subLeadArticles = nonLeadArticles.slice(0, 2);
  const secondaryHeroArticles = nonLeadArticles.slice(2, 8);

  const trendingArticles = mappedArticles.filter((a) => a.isTrending);

  // Category archive articles
  const categoryArticles = (activeCategorySlug === 'latest' || activeCategorySlug === 'news')
    ? mappedArticles
    : mappedArticles.filter((a) => matchCategory(a.categorySlug, a.category, activeCategorySlug));

  // If in admin view, render AdminDashboard directly
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onExitAdmin={handleNavigateHome}
        onViewPublicArticle={(slug) => handleSelectArticle(slug)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans selection:bg-[#F5B800] selection:text-black">
      {/* Dynamic SEO Meta based on active route */}
      {currentView === 'home' && <SEOHead type="website" />}
      {currentView === 'article' && currentArticle && <SEOHead article={currentArticle} type="article" />}
      {currentView === 'category' && <SEOHead title={activeCategorySlug.toUpperCase()} type="website" />}
      {currentView === 'magazine' && <SEOHead title="The Founder Magazine" type="website" />}
      {currentView === 'author' && <SEOHead title="Arjun Sindhu" type="website" />}
      {currentView === 'policy' && <SEOHead title={activePolicyType.toUpperCase().replace('-', ' ')} type="website" />}

      {/* 1. TOP UTILITY BAR + 2. BRAND MASTHEAD + 3. PRIMARY NAVIGATION */}
      <Header
        currentCategory={currentView === 'category' ? activeCategorySlug : undefined}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSubscribe={() => {
          const el = document.getElementById('newsletter-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateHome={handleNavigateHome}
        onNavigateMagazine={handleNavigateMagazine}
        onNavigatePolicy={handleNavigatePolicy}
      />

      {/* Top Banner Ad Slot */}
      <AdSlot position="top" />

      {/* 4. AUTO-SCROLLING LATEST NEWS TICKER (Dynamic CMS-driven) */}
      <LatestNewsTicker onSelectArticle={handleSelectArticle} />

      {/* 5. BREAKING NEWS ALERT STRIP (Dynamic CMS-driven) */}
      <BreakingNewsBar onSelectArticle={handleSelectArticle} />

      {/* Between Ticker & Hero Ad Slot */}
      <AdSlot position="between-ticker-hero" />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: Full Article Template */}
        {currentView === 'article' && currentArticle && (
          <ArticlePage
            article={currentArticle}
            allArticles={mappedArticles}
            onNavigateBack={handleNavigateHome}
            onSelectArticle={handleSelectArticle}
            onSelectAuthor={handleSelectAuthor}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* VIEW 2: The Founder Magazine */}
        {currentView === 'magazine' && (
          <MagazinePage
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {/* VIEW 3: Dedicated Author View */}
        {currentView === 'author' && currentAuthor && (
          <AuthorPage
            author={currentAuthor}
            articles={mappedArticles.filter((a) => a.author.name.toLowerCase().includes(activeAuthorSlug.replace(/-/g, ' ')))}
            onNavigateBack={handleNavigateHome}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* VIEW 4: Transparency & Policy Pages */}
        {currentView === 'policy' && (
          <PolicyPage
            pageType={activePolicyType}
            onNavigateBack={handleNavigateHome}
            onSelectAuthor={handleSelectAuthor}
          />
        )}

        {/* VIEW 5: Category Archive View */}
        {currentView === 'category' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-4">
              <button onClick={handleNavigateHome} className="hover:text-black transition-colors">
                FRONT PAGE
              </button>
              <span>/</span>
              <span className="text-black uppercase font-bold">{activeCategorySlug}</span>
            </div>

            <div className="pb-4 mb-6 border-b-2 border-neutral-900 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#F5B800]"></span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
                    {activeCategorySlug}
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-serif">
                  Comprehensive reporting and verified industry analysis.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                {categoryArticles.length} STORIES IN DISPATCH
              </span>
            </div>

            {/* Target Page Section Primary Ad Banner (e.g. News Feed Primary Ad Banner) */}
            <AdSlot 
              pageType={activeCategorySlug === 'latest' ? 'news' : activeCategorySlug} 
              placement={activeCategorySlug === 'news' || activeCategorySlug === 'latest' ? 'news-primary' : `${activeCategorySlug}-primary`} 
              className="my-6" 
            />

            {categoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    variant="secondary"
                    onSelectArticle={handleSelectArticle}
                    onSelectCategory={handleSelectCategory}
                    onSelectAuthor={handleSelectAuthor}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-500 font-mono text-xs">
                <p className="font-bold">
                  NEW STORIES IN THIS SECTION ARE BEING ASSEMBLED BY THE NEWSROOM.
                </p>
                <button
                  onClick={handleNavigateHome}
                  className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Return to Top Stories
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: Homepage (DYNAMIC CMS SECTIONS BUILDER) */}
        {currentView === 'home' && (
          <>
            {isLoading ? (
              <EditorialLoadingSkeleton />
            ) : isError ? (
              <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="inline-block p-6 sm:p-8 bg-neutral-50 border border-neutral-300 max-w-md w-full">
                  <p className="text-sm font-mono text-neutral-800 font-bold uppercase tracking-wider mb-2">
                    Unable to load the latest stories. Please try again.
                  </p>
                  <p className="text-xs text-neutral-500 font-serif mb-4">
                    Connecting to live Supabase newsroom dispatch.
                  </p>
                  <button
                    onClick={() => loadDynamicContent(true)}
                    className="mt-2 px-5 py-2.5 bg-neutral-900 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer transition-colors shadow-xs"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            ) : mappedArticles.length === 0 ? (
              <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="inline-block p-8 bg-neutral-50 border border-neutral-200 max-w-md w-full">
                  <p className="text-xs font-mono text-neutral-500 font-bold uppercase tracking-wider mb-2">
                    LATEST STORIES
                  </p>
                  <p className="text-sm font-serif text-neutral-700">
                    No latest stories available. New stories are being assembled by the newsroom.
                  </p>
                </div>
              </div>
            ) : (
              (sections.length > 0 ? sections : DEFAULT_FALLBACK_SECTIONS)
                .filter((sec) => sec.is_visible)
                .map((section, sIndex) => {
                // Render Section by Type
                if (section.section_type === 'hero') {
                  if (!leadHeroArticle) return null;
                  return (
                    <React.Fragment key={section.id}>
                      <HeroSection
                        leadArticle={leadHeroArticle}
                        secondaryArticles={secondaryHeroArticles}
                        subLeadArticles={subLeadArticles}
                        onSelectArticle={handleSelectArticle}
                        onSelectCategory={handleSelectCategory}
                        onSelectAuthor={handleSelectAuthor}
                      />
                      {sIndex === 0 && <AdSlot position="between-sections" />}
                    </React.Fragment>
                  );
                }

                if (section.section_type === 'wire-trending' || section.section_type === 'latest') {
                  return (
                    <React.Fragment key={section.id}>
                      <LatestAndTrendingSection
                        latestArticles={mappedArticles}
                        trendingArticles={trendingArticles}
                        onSelectArticle={handleSelectArticle}
                        onSelectCategory={handleSelectCategory}
                      />
                      <AdSlot pageType="news" placement="news-primary" position="between-sections" />
                    </React.Fragment>
                  );
                }

                if (section.section_type === 'magazine') {
                  return (
                    <MagazineShowcase
                      key={section.id}
                      issue={magazineIssue}
                      onNavigateMagazine={handleNavigateMagazine}
                      onSelectArticle={handleSelectArticle}
                    />
                  );
                }

                // Category or Custom News Section
                const targetCategory = section.category_slug || section.slug;
                const sectionStories = mappedArticles.filter((a) =>
                  matchCategory(a.categorySlug, a.category, targetCategory)
                );

                // Section 30 Empty States: "If a section has no stories, automatically hide the section"
                if (sectionStories.length === 0) {
                  return null;
                }

                return (
                  <CategorySection
                    key={section.id}
                    title={section.name}
                    categorySlug={targetCategory}
                    articles={sectionStories.slice(0, section.story_count || 4)}
                    layout={section.layout_type}
                    onSelectArticle={handleSelectArticle}
                    onSelectCategory={handleSelectCategory}
                    onSelectAuthor={handleSelectAuthor}
                  />
                );
              })
            )}

            {/* Newsletter Dispatch Box */}
            <div id="newsletter-section">
              <NewsletterBox />
            </div>
          </>
        )}
      </main>

      {/* Footer Ad Slot */}
      <AdSlot position="footer" />

      {/* 5-Column News Publication Footer with Admin Access Link */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onNavigatePolicy={handleNavigatePolicy}
        onNavigateHome={handleNavigateHome}
        onNavigateMagazine={handleNavigateMagazine}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* Real-time Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectArticle={handleSelectArticle}
        onSelectAuthor={handleSelectAuthor}
        articles={mappedArticles}
      />

      {/* Admin Login Modal (Triggered from Footer 'Admin Access') */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

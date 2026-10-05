import { 
  CMSArticle, 
  CMSSection, 
  CMSBreakingNews, 
  CMSAdvertisement, 
  CMSAdSlot,
  CMSMagazineIssue, 
  CMSAuthor, 
  CMSCategory, 
  CMSSiteSettings,
  RealtimeStatus,
  AdPageType,
  SectionLayoutType
} from '../types/cms';
import { getSupabaseClient, isSupabaseConfigured, ensureAdminAuth } from '../lib/supabase';
import { convertBlocksToArticleBody, calculateReadingTime, isValidUUID } from '../utils/articleBodyUtils';

// In-memory subscribers
type ContentListener = () => void;
type StatusListener = (status: RealtimeStatus) => void;
const listeners = new Set<ContentListener>();
const statusListeners = new Set<StatusListener>();

let currentRealtimeStatus: RealtimeStatus = 'LOCAL';
let broadcastChannel: BroadcastChannel | null = null;
let realtimeChannel: any = null;

// Lightweight caching layer for instant initial page render & zero flash
const CACHE_KEY_ARTICLES = 'fb_cache_articles_v3';
const CACHE_KEY_SECTIONS = 'fb_cache_sections_v3';
const CACHE_KEY_ISSUES = 'fb_cache_issues_v3';

let memCachedArticles: CMSArticle[] | null = null;
let memCachedSections: CMSSection[] | null = null;
let memCachedIssues: CMSMagazineIssue[] | null = null;
let inFlightArticlesPromise: Promise<CMSArticle[]> | null = null;

function getCachedData<T>(key: string, memVal: T | null): T | null {
  if (memVal && Array.isArray(memVal) && memVal.length > 0) {
    return memVal;
  }
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data as T;
    }
  } catch {
    // ignore
  }
  return null;
}

function setCachedData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // ignore
  }
}

function clearCache() {
  memCachedArticles = null;
  memCachedSections = null;
  memCachedIssues = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CACHE_KEY_ARTICLES);
      localStorage.removeItem(CACHE_KEY_SECTIONS);
      localStorage.removeItem(CACHE_KEY_ISSUES);
    } catch {
      // ignore
    }
  }
}

// Initialize cross-tab broadcast channel for instant multi-tab sync
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('fb_realtime_bus');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'CONTENT_CHANGED') {
        notifySubscribersLocalOnly();
      }
    };
  }
} catch {
  // Graceful fallback
}

function notifySubscribersLocalOnly() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
}

function notifySubscribers() {
  clearCache();
  notifySubscribersLocalOnly();
  try {
    broadcastChannel?.postMessage({ type: 'CONTENT_CHANGED', timestamp: Date.now() });
  } catch {
    // ignore
  }
}

function updateStatus(status: RealtimeStatus) {
  currentRealtimeStatus = status;
  statusListeners.forEach((cb) => {
    try {
      cb(status);
    } catch {
      // ignore
    }
  });
}

// Setup Supabase Realtime channel
export function initSupabaseRealtime() {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured()) {
    updateStatus('LOCAL');
    return;
  }

  if (realtimeChannel) {
    try {
      supabase.removeChannel(realtimeChannel);
    } catch {
      // ignore
    }
    realtimeChannel = null;
  }

  updateStatus('CONNECTING');

  try {
    const channel = supabase.channel('founder-bytes-realtime');

    const tables = [
      'articles',
      'article_blocks',
      'homepage_sections',
      'breaking_news',
      'advertisements',
      'magazine_issues',
      'categories',
      'authors',
      'site_settings'
    ];

    tables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          notifySubscribers();
        }
      );
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        updateStatus('LIVE');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        updateStatus('RECONNECTING');
      } else if (status === 'CLOSED') {
        updateStatus('LOCAL');
      }
    });

    realtimeChannel = channel;
  } catch (err) {
    console.warn('Supabase Realtime subscription error:', err);
    updateStatus('RECONNECTING');
  }
}

// Auto-initialize realtime on client load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initSupabaseRealtime();
  }, 100);
}

// Helper to map Supabase article row with joined tables to CMSArticle
function mapDbRowToCMSArticle(d: any): CMSArticle {
  const blocks = (d.article_blocks || []).sort(
    (a: any, b: any) => (a.display_order ?? a.position ?? 0) - (b.display_order ?? b.position ?? 0)
  );

  // 1. Unified Rich-Text Article Body:
  // Look for dedicated full article body paragraph or rich-text block; otherwise convert legacy blocks to HTML
  const bodyBlock = blocks.find((b: any) => 
    b.block_type === 'article_body' || 
    b.block_type === 'rich_text' ||
    (b.block_type === 'paragraph' && (b.display_order === 0 || b.position === 0) && (b.content?.includes('<p>') || b.content?.includes('<h') || b.content?.includes('<div')))
  );
  const articleBodyHtml = bodyBlock?.content || convertBlocksToArticleBody(blocks);

  // 2. Extra SEO & Entity Metadata Block:
  let extraMeta: any = {};
  const metaBlock = blocks.find((b: any) => 
    b.block_type === 'seo_metadata' ||
    (b.block_type === 'embed' && b.embed_url === 'fb_metadata')
  );
  if (metaBlock && metaBlock.content) {
    try {
      extraMeta = JSON.parse(metaBlock.content);
    } catch {
      // ignore
    }
  }

  const rawParagraphs = blocks
    .filter((b: any) => b.block_type === 'paragraph' && b.content)
    .map((b: any) => b.content);

  const categoryName = d.categories?.name || 'Startups';
  const categorySlug = d.categories?.slug || 'startups';
  const authorName = d.authors?.name || 'Arjun Sindhu';
  const authorRole = d.authors?.designation || 'Founder & Editor-in-Chief';
  const authorAvatar =
    d.authors?.photo_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return {
    id: d.id,
    slug: d.slug,
    title: d.title,
    subtitle: d.subtitle || d.excerpt || '',
    category_id: d.category_id || '',
    category_name: categoryName,
    category_slug: categorySlug,
    sub_category: d.sub_category,
    author_id: (d.author_id && isValidUUID(d.author_id)) ? d.author_id : 'a925a3a4-abd9-4ebb-8966-b5fed4592371',
    author_name: authorName,
    author_role: authorRole,
    author_avatar: authorAvatar,
    featured_image: d.featured_image_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    image_caption: d.featured_image_caption || '',
    image_credit: d.featured_image_credit || 'Founder Bytes',
    featured_image_alt: d.featured_image_alt || d.title,
    featured_image_source_url: extraMeta.featured_image_source_url || '',
    article_body: articleBodyHtml,
    content_blocks: blocks.map((b: any) => ({
      id: b.id,
      block_type: (b.block_type as any) || 'paragraph',
      position: b.display_order ?? b.position ?? 0,
      content: b.content || '',
      image_url: b.image_url,
      image_caption: b.image_caption,
      image_credit: b.image_credit,
      attribution: b.quote_author,
    })),
    raw_paragraphs: rawParagraphs.length > 0 ? rawParagraphs : [d.subtitle || d.excerpt || d.title],
    status: (d.status as any) || 'published',
    published_at: d.published_at || d.created_at || new Date().toISOString(),
    updated_at: d.updated_at || d.published_at || d.created_at || new Date().toISOString(),
    scheduled_at: d.scheduled_at || null,
    reading_time_minutes: d.reading_time || calculateReadingTime(articleBodyHtml || d.subtitle || ''),
    tags: d.tags || [categoryName],
    source_name: d.source_name || 'Founder Bytes Newsroom',
    source_url: d.source_url || `https://founderbytes.in/${d.slug}`,
    source_type: extraMeta.source_type || 'Original Reporting',
    location: extraMeta.location || '',
    article_type: extraMeta.article_type || 'News Wire',
    is_featured: Boolean(d.is_featured),
    is_trending: Boolean(d.is_trending),
    is_breaking: false,
    is_editor_pick: Boolean(d.is_featured),
    priority: d.is_featured ? 100 : 0,
    seo_title: d.seo_title || d.title,
    seo_description: d.seo_description || d.subtitle || d.excerpt || '',
    focus_keyword: extraMeta.focus_keyword || '',
    secondary_keywords: extraMeta.secondary_keywords || [],
    canonical_url: extraMeta.canonical_url || `https://founderbytes.in/${d.slug}`,
    robots_meta: extraMeta.robots_meta || 'index, follow',
    og_title: extraMeta.og_title || '',
    og_description: extraMeta.og_description || '',
    og_image: extraMeta.og_image || '',
    twitter_title: extraMeta.twitter_title || '',
    twitter_description: extraMeta.twitter_description || '',
    twitter_image: extraMeta.twitter_image || '',
    schema_type: extraMeta.schema_type || 'NewsArticle',
    entities: extraMeta.entities || {},
    quote_text: d.quote_text,
    quote_author: d.quote_author,
    is_sponsored: false,
  };
}

export const DEFAULT_AD_SLOTS: CMSAdSlot[] = [
  {
    id: '60b54e3d-cf48-48a6-904f-f86ecf023c88',
    slot_name: 'News Page Advertisement',
    page_type: 'news',
    placement_key: 'news-primary',
    description: 'Primary advertisement for the News page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 1,
  },
  {
    id: 'ad18ec68-2c47-448f-ac4e-d225aa6633f4',
    slot_name: 'Startups Page Advertisement',
    page_type: 'startups',
    placement_key: 'startups-primary',
    description: 'Primary advertisement for the Startups page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 2,
  },
  {
    id: '264dfaed-6e47-4370-802f-1168750ba5fe',
    slot_name: 'Business Page Advertisement',
    page_type: 'business',
    placement_key: 'business-primary',
    description: 'Primary advertisement for the Business page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 3,
  },
  {
    id: 'f7824558-8351-496a-80b5-a3b0931df8d1',
    slot_name: 'Technology Page Advertisement',
    page_type: 'tech',
    placement_key: 'tech-primary',
    description: 'Primary advertisement for the Technology page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 4,
  },
  {
    id: '4ed64006-019e-4fb3-9135-35b602804b53',
    slot_name: 'AI Page Advertisement',
    page_type: 'ai',
    placement_key: 'ai-primary',
    description: 'Primary advertisement for the AI page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 5,
  },
  {
    id: '44ecdb83-34b3-4ff8-9753-41ae09a18321',
    slot_name: 'Founders Page Advertisement',
    page_type: 'founders',
    placement_key: 'founders-primary',
    description: 'Primary advertisement for the Founders page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 6,
  },
  {
    id: '3228a6a5-7af5-4e0c-a2be-60db6916a45c',
    slot_name: 'Funding Page Advertisement',
    page_type: 'funding',
    placement_key: 'funding-primary',
    description: 'Primary advertisement for the Funding page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 7,
  },
  {
    id: 'b52af903-50d5-4baf-ad7a-03235b731fe6',
    slot_name: 'Innovation Page Advertisement',
    page_type: 'innovation',
    placement_key: 'innovation-primary',
    description: 'Primary advertisement for the Innovation page',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 8,
  },
  {
    id: '98166470-b89e-4e7d-8f55-0ee5a2b6b787',
    slot_name: 'Article Page Advertisement',
    page_type: 'article',
    placement_key: 'article-primary',
    description: 'Primary advertisement for individual articles',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 9,
  },
  {
    id: 'ad82c7ce-137c-4159-a8fe-bbc372f30c4d',
    slot_name: 'Magazine Page Advertisement',
    page_type: 'magazine',
    placement_key: 'magazine-primary',
    description: 'Primary advertisement for The Founder Magazine',
    width: 728,
    height: 90,
    recommended_width: 728,
    recommended_height: 90,
    is_active: true,
    display_order: 10,
  },
];

function mapDbRowToCMSAdvertisement(d: any): CMSAdvertisement {
  const adSlot = d.ad_slots || {};
  return {
    id: d.id,
    name: d.name || '',
    advertiser: d.advertiser_name || d.advertiser || '',
    image_url: d.image_url || '',
    image_alt: d.image_alt || d.name || '',
    image_width: d.image_width || adSlot.width || 728,
    image_height: d.image_height || adSlot.height || 90,
    destination_url: d.destination_url || '',
    slot_id: d.slot_id || adSlot.id || '',
    page: adSlot.page_type || d.page || 'news',
    placement: adSlot.placement_key || d.placement || 'news-primary',
    ad_type: 'banner',
    start_date: d.start_at || d.start_date || d.created_at || new Date().toISOString(),
    end_date: d.end_at || d.end_date || undefined,
    is_active: Boolean(d.is_active),
    created_at: d.created_at,
    updated_at: d.updated_at,
  };
}

export const ContentService = {
  // Subscription API
  subscribe(listener: ContentListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  subscribeStatus(listener: StatusListener): () => void {
    statusListeners.add(listener);
    listener(currentRealtimeStatus);
    return () => statusListeners.delete(listener);
  },

  getRealtimeStatus(): RealtimeStatus {
    return currentRealtimeStatus;
  },

  // Synchronous cache access for instant zero-flash initial render
  getCachedArticles(): CMSArticle[] | null {
    return getCachedData<CMSArticle[]>(CACHE_KEY_ARTICLES, memCachedArticles);
  },

  getCachedSections(): CMSSection[] | null {
    return getCachedData<CMSSection[]>(CACHE_KEY_SECTIONS, memCachedSections);
  },

  getCachedMagazineIssues(): CMSMagazineIssue[] | null {
    return getCachedData<CMSMagazineIssue[]>(CACHE_KEY_ISSUES, memCachedIssues);
  },

  // Media Upload to Supabase Storage
  async uploadMedia(
    file: File, 
    bucket: 'article-images' | 'author-images' | 'magazine-covers' | 'advertisements' | 'site-assets',
    folder = 'uploads'
  ): Promise<{ url: string; path: string; name: string; size: number }> {
    const supabase = getSupabaseClient();
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `${folder}/${cleanFileName}`;

    if (supabase && isSupabaseConfigured()) {
      try {
        await ensureAdminAuth();
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

          return {
            url: publicUrlData.publicUrl,
            path: data.path,
            name: file.name,
            size: file.size,
          };
        }
      } catch (err) {
        console.warn('Supabase storage upload error:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: `local/${cleanFileName}`,
          name: file.name,
          size: file.size,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // 1. ARTICLES: Fetch directly from Supabase with performance optimization & in-flight deduplication
  async getArticles(filter?: {
    category?: string;
    status?: string;
    is_featured?: boolean;
    is_trending?: boolean;
    limit?: number;
    includeBlocks?: boolean;
    skipCache?: boolean;
  }): Promise<CMSArticle[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      const cached = getCachedData<CMSArticle[]>(CACHE_KEY_ARTICLES, memCachedArticles);
      if (cached && cached.length > 0) return cached;
      throw new Error('Supabase client is not configured.');
    }

    const isDefaultQuery =
      !filter?.category &&
      (!filter?.status || filter.status === 'published') &&
      !filter?.limit &&
      !filter?.is_featured &&
      !filter?.is_trending &&
      !filter?.includeBlocks;

    // Deduplicate in-flight requests for the default published feed
    if (isDefaultQuery && inFlightArticlesPromise) {
      return inFlightArticlesPromise;
    }

    const fetchPromise = (async () => {
      // PERFORMANCE OPTIMIZATION: Only join article_blocks if explicitly requested.
      // Card listings (homepage, category, ticker) only need article metadata and authors/categories.
      const selectFields = filter?.includeBlocks
        ? '*, categories(id, name, slug), authors(id, name, slug, designation, bio, photo_url), article_blocks(*)'
        : '*, categories(id, name, slug), authors(id, name, slug, designation, bio, photo_url)';

      let query = supabase.from('articles').select(selectFields);

      // Status filter: default to 'published' for public website
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      } else if (!filter?.status) {
        query = query.eq('status', 'published');
      }

      if (filter?.is_trending) {
        query = query.eq('is_trending', true);
      }
      if (filter?.is_featured) {
        query = query.eq('is_featured', true);
      }

      query = query.order('published_at', { ascending: false });

      if (filter?.limit) {
        query = query.limit(filter.limit);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase getArticles error:', error.message);
        const cached = getCachedData<CMSArticle[]>(CACHE_KEY_ARTICLES, memCachedArticles);
        if (cached && cached.length > 0) return cached;
        throw new Error(error.message);
      }

      if (!data) return [];

      let articles = data.map(mapDbRowToCMSArticle);

      // Filter by category if requested
      if (filter?.category && filter.category !== 'all') {
        const catTarget = filter.category.toLowerCase();
        articles = articles.filter(
          (a) =>
            a.category_slug.toLowerCase() === catTarget ||
            a.category_name.toLowerCase() === catTarget ||
            (catTarget === 'tech' && (a.category_slug === 'technology' || a.category_slug === 'tech'))
        );
      }

      if (isDefaultQuery) {
        memCachedArticles = articles;
        setCachedData(CACHE_KEY_ARTICLES, articles);
      }

      return articles;
    })();

    if (isDefaultQuery) {
      inFlightArticlesPromise = fetchPromise.finally(() => {
        inFlightArticlesPromise = null;
      });
      return inFlightArticlesPromise;
    }

    return fetchPromise;
  },

  // Single article by slug
  async getArticleBySlug(slug: string): Promise<CMSArticle | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*, categories(id, name, slug), authors(id, name, slug, designation, bio, photo_url), article_blocks(*)')
        .eq('slug', slug)
        .single();

      if (error || !data) return null;
      return mapDbRowToCMSArticle(data);
    } catch {
      return null;
    }
  },

  // Save / Update Article in Supabase
  async saveArticle(article: CMSArticle): Promise<CMSArticle> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured.');
    }

    // Ensure admin auth session is active
    await ensureAdminAuth();

    // 1. Resolve Category ID (Strict UUID verification)
    let categoryId = article.category_id;
    if (!isValidUUID(categoryId)) {
      if (article.category_slug) {
        const { data: catData } = await supabase
          .from('categories')
          .select('id, slug')
          .eq('slug', article.category_slug.toLowerCase())
          .limit(1)
          .single();
        if (catData && isValidUUID(catData.id)) {
          categoryId = catData.id;
        }
      }
      if (!isValidUUID(categoryId)) {
        // Fallback to first active category (founders/startups)
        const { data: defaultCat } = await supabase.from('categories').select('id').limit(1).single();
        categoryId = defaultCat?.id || '485f6526-d2f8-458d-839d-794a5cf29665';
      }
    }

    // 2. Resolve Author ID (Strict UUID verification)
    let authorId = article.author_id;
    if (!isValidUUID(authorId)) {
      const { data: authData } = await supabase
        .from('authors')
        .select('id')
        .eq('slug', 'arjun-sindhu')
        .limit(1)
        .single();
      authorId = authData?.id || 'a925a3a4-abd9-4ebb-8966-b5fed4592371';
    }

    if (!isValidUUID(authorId)) {
      throw new Error(`Invalid author UUID: "${authorId}". Please select a valid author from the database.`);
    }
    if (!isValidUUID(categoryId)) {
      throw new Error(`Invalid category UUID: "${categoryId}". Please select a valid category from the database.`);
    }

    // 3. Prepare Article Payload matching Supabase schema exactly
    const payload: any = {
      title: article.title,
      slug: article.slug,
      subtitle: article.subtitle,
      excerpt: article.subtitle,
      category_id: categoryId,
      author_id: authorId,
      featured_image_url: article.featured_image,
      featured_image_alt: article.featured_image_alt || article.title,
      featured_image_caption: article.image_caption || null,
      featured_image_credit: article.image_credit || 'Founder Bytes',
      status: article.status || 'published',
      is_featured: Boolean(article.is_featured),
      is_trending: Boolean(article.is_trending),
      seo_title: article.seo_title || article.title,
      seo_description: article.seo_description || article.subtitle,
      source_name: article.source_name || 'Founder Bytes',
      source_url: article.source_url || `https://founderbytes.in/${article.slug}`,
      published_at: article.published_at || new Date().toISOString(),
      reading_time: article.reading_time_minutes || calculateReadingTime(article.article_body || article.subtitle || ''),
      updated_at: new Date().toISOString(), // dateModified automatically updates
    };

    if (article.scheduled_at !== undefined) {
      payload.scheduled_at = article.scheduled_at;
    }

    // Include ID only if it's an existing valid UUID
    if (article.id && isValidUUID(article.id)) {
      payload.id = article.id;
    }

    const { data: savedArticle, error: saveErr } = await supabase
      .from('articles')
      .upsert(payload)
      .select('*, categories(*), authors(*)')
      .single();

    if (saveErr) {
      console.error('Supabase saveArticle error:', saveErr.message);
      throw saveErr;
    }

    const savedId = savedArticle.id;

    // 4. Update Article Content Blocks (Unified Single Full Article Body + Metadata Block)
    // Delete existing blocks for this article
    await supabase.from('article_blocks').delete().eq('article_id', savedId);

    const blockRows: any[] = [];

    // Block 0: Primary Unified Full Article Body Rich-Text in compliant 'paragraph' block
    const bodyHtml = article.article_body || (article.raw_paragraphs && article.raw_paragraphs.length > 0 ? article.raw_paragraphs.map((p) => `<p>${p}</p>`).join('\n') : `<p>${article.subtitle || article.title}</p>`);
    blockRows.push({
      article_id: savedId,
      block_type: 'paragraph',
      content: bodyHtml,
      display_order: 0,
    });

    // Block 1: Extra SEO & Entity Metadata in compliant 'embed' block
    const metaPayload = {
      focus_keyword: article.focus_keyword || '',
      secondary_keywords: article.secondary_keywords || [],
      canonical_url: article.canonical_url || `https://founderbytes.in/${article.slug}`,
      robots_meta: article.robots_meta || 'index, follow',
      og_title: article.og_title || '',
      og_description: article.og_description || '',
      og_image: article.og_image || '',
      twitter_title: article.twitter_title || '',
      twitter_description: article.twitter_description || '',
      twitter_image: article.twitter_image || '',
      schema_type: article.schema_type || (article.is_sponsored ? 'Article' : 'NewsArticle'),
      source_type: article.source_type || 'Original Reporting',
      location: article.location || '',
      article_type: article.article_type || 'News Wire',
      entities: article.entities || {},
      featured_image_source_url: article.featured_image_source_url || '',
    };

    blockRows.push({
      article_id: savedId,
      block_type: 'embed',
      embed_url: 'fb_metadata',
      content: JSON.stringify(metaPayload),
      display_order: 9999,
    });

    await supabase.from('article_blocks').insert(blockRows);

    notifySubscribers();

    return mapDbRowToCMSArticle({
      ...savedArticle,
      article_blocks: blockRows,
    });
  },

  // Delete Article from Supabase
  async deleteArticle(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;

    await ensureAdminAuth();

    // Delete blocks first, then article
    await supabase.from('article_blocks').delete().eq('article_id', id);
    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      console.error('Supabase deleteArticle error:', error.message);
      throw error;
    }

    notifySubscribers();
  },

  // 2. HOMEPAGE SECTIONS
  async getSections(): Promise<CMSSection[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      const cached = getCachedData<CMSSection[]>(CACHE_KEY_SECTIONS, memCachedSections);
      return cached || [];
    }

    try {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*, categories(slug)')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        const cached = getCachedData<CMSSection[]>(CACHE_KEY_SECTIONS, memCachedSections);
        return cached || [];
      }

      const hasHero = data.some((d: any) => d.section_type === 'hero' || d.section_key === 'main-hero' || d.section_key === 'hero');

      const mappedSections: CMSSection[] = data.map((d: any) => {
        let categorySlug = d.categories?.slug || d.section_key;
        if (categorySlug === 'startup-news') categorySlug = 'startups';
        if (categorySlug === 'business-news') categorySlug = 'business';
        if (categorySlug === 'technology-news') categorySlug = 'tech';
        if (categorySlug === 'ai-news') categorySlug = 'ai';

        let sectionType = d.section_type;
        if (d.section_key === 'main-hero' || d.section_key === 'hero') sectionType = 'hero';
        if (d.section_key === 'latest' && (sectionType === 'latest' || !sectionType)) sectionType = 'wire-trending';

        let layout: SectionLayoutType = 'grid-3';
        if (sectionType === 'hero') layout = 'startup-split';
        else if (categorySlug === 'startups') layout = 'startup-split';
        else if (categorySlug === 'tech') layout = 'tech-grid';
        else if (categorySlug === 'funding') layout = 'funding-table';
        else if (categorySlug === 'founders') layout = 'founders-mosaic';

        return {
          id: d.id,
          name: d.title,
          slug: d.section_key,
          section_type: (sectionType as any) || 'category',
          description: d.description || '',
          display_order: d.display_order,
          is_visible: d.is_active,
          story_count: d.max_items || 4,
          layout_type: layout,
          category_slug: categorySlug,
          created_at: d.created_at,
          updated_at: d.updated_at,
        };
      });

      if (!hasHero) {
        mappedSections.unshift({
          id: 'sec-hero',
          name: 'Top News Lead & Desk Wire',
          slug: 'main-hero',
          section_type: 'hero',
          description: 'Dominant news lead and desk dispatch',
          display_order: 0,
          is_visible: true,
          story_count: 6,
          layout_type: 'startup-split',
          created_at: '',
          updated_at: '',
        });
      }

      memCachedSections = mappedSections;
      setCachedData(CACHE_KEY_SECTIONS, mappedSections);
      return mappedSections;
    } catch {
      const cached = getCachedData<CMSSection[]>(CACHE_KEY_SECTIONS, memCachedSections);
      return cached || [];
    }
  },

  async saveSection(section: CMSSection): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    const payload: any = {
      section_key: section.slug,
      title: section.name,
      description: section.description,
      section_type: section.section_type,
      display_order: section.display_order,
      is_active: section.is_visible,
      max_items: section.story_count || 4,
      updated_at: new Date().toISOString(),
    };

    if (section.id && section.id.includes('-') && section.id.length > 30) {
      payload.id = section.id;
    }

    await supabase.from('homepage_sections').upsert(payload);
    notifySubscribers();
  },

  async reorderSections(orderedIds: string[]): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await Promise.all(
      orderedIds.map((id, index) =>
        supabase
          .from('homepage_sections')
          .update({ display_order: index + 1, updated_at: new Date().toISOString() })
          .eq('id', id)
      )
    );
    notifySubscribers();
  },

  async deleteSection(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('homepage_sections').delete().eq('id', id);
    notifySubscribers();
  },

  // 3. BREAKING NEWS ALERTS
  async getBreakingNews(): Promise<CMSBreakingNews[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('breaking_news')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data) return [];

      return data.map((d: any) => ({
        id: d.id,
        headline: d.headline,
        link: d.link_url || '#',
        is_active: d.is_active,
        priority: 10 - (d.display_order || 0),
        display_order: d.display_order || 1,
        created_at: d.created_at,
      }));
    } catch {
      return [];
    }
  },

  async saveBreakingNews(item: CMSBreakingNews): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    const payload: any = {
      headline: item.headline,
      link_url: item.link,
      is_active: item.is_active,
      display_order: item.display_order || 1,
    };
    if (item.id && item.id.includes('-') && item.id.length > 30) {
      payload.id = item.id;
    }

    await supabase.from('breaking_news').upsert(payload);
    notifySubscribers();
  },

  async deleteBreakingNews(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('breaking_news').delete().eq('id', id);
    notifySubscribers();
  },

  // 4. ADVERTISEMENTS & AD SLOTS
  async getAdSlots(): Promise<CMSAdSlot[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      return DEFAULT_AD_SLOTS;
    }
    try {
      const { data, error } = await supabase
        .from('ad_slots')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return DEFAULT_AD_SLOTS;
      }
      return data.map((s: any) => ({
        id: s.id,
        slot_name: s.slot_name,
        page_type: s.page_type,
        placement_key: s.placement_key,
        description: s.description,
        width: s.width || 728,
        height: s.height || 90,
        recommended_width: s.recommended_width || 728,
        recommended_height: s.recommended_height || 90,
        is_active: Boolean(s.is_active),
        display_order: s.display_order || 0,
        created_at: s.created_at,
        updated_at: s.updated_at,
      }));
    } catch {
      return DEFAULT_AD_SLOTS;
    }
  },

  async getAdvertisements(
    placement?: string, 
    page?: AdPageType | string, 
    includeInactive: boolean = false
  ): Promise<CMSAdvertisement[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('advertisements')
        .select('*, ad_slots(*)')
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('getAdvertisements error from Supabase:', error);
        return [];
      }
      if (!data) return [];

      const mapped = data.map(mapDbRowToCMSAdvertisement);

      return mapped.filter((item) => {
        // Date active checking for public requests
        if (!includeInactive) {
          if (!item.is_active) return false;
          const now = Date.now();
          if (item.start_date) {
            const startTime = new Date(item.start_date).getTime();
            if (!isNaN(startTime) && startTime > now) return false;
          }
          if (item.end_date) {
            const endTime = new Date(item.end_date).getTime();
            if (!isNaN(endTime) && endTime < now) return false;
          }
        }

        // Placement filtering
        if (placement && placement !== 'all') {
          const matchPlacement =
            item.placement === placement ||
            item.slot_id === placement ||
            (placement === 'news-primary' && (item.page === 'news' || item.placement.includes('news'))) ||
            (placement === 'top' && item.page === 'all') ||
            (placement === 'footer' && item.page === 'all') ||
            (placement === 'between-ticker-hero' && item.page === 'all') ||
            (placement === 'between-sections' && item.page === 'all');

          if (!matchPlacement) {
            if (page && page !== 'all' && (item.page === page || item.placement.startsWith(page))) {
              return true;
            }
            return false;
          }
        }

        // Target page filtering
        if (page && page !== 'all') {
          if (item.page === 'all') return true;
          if (item.page === page) return true;
          if (item.placement.startsWith(page)) return true;
          if ((page === 'technology' || page === 'tech') && (item.page === 'tech' || item.page === 'technology')) return true;
          return false;
        }

        return true;
      });
    } catch (err) {
      console.error('getAdvertisements exception:', err);
      return [];
    }
  },

  async saveAdvertisement(
    ad: Partial<CMSAdvertisement> & { name: string; destination_url?: string }
  ): Promise<CMSAdvertisement> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Database is not configured. Unable to connect to Supabase.');
    }
    await ensureAdminAuth();

    if (!ad.name || !ad.name.trim()) {
      throw new Error('Campaign Name is required.');
    }
    if (!ad.advertiser || !ad.advertiser.trim()) {
      throw new Error('Advertiser / Brand is required.');
    }
    if (!ad.image_url || !ad.image_url.trim()) {
      throw new Error('Advertisement banner image creative is required. Please upload or provide a banner image.');
    }
    if (!ad.destination_url || !ad.destination_url.trim()) {
      throw new Error('Destination URL is required.');
    }

    // Resolve slot_id to genuine UUID from ad_slots
    let resolvedSlotId = ad.slot_id;
    if (!resolvedSlotId || !isValidUUID(resolvedSlotId)) {
      const slots = await this.getAdSlots();
      const targetKey = ad.placement || ad.page || 'news-primary';
      const matched = slots.find(
        (s) =>
          s.id === targetKey ||
          s.placement_key === targetKey ||
          s.page_type === targetKey ||
          (ad.page && s.page_type === ad.page) ||
          (ad.placement && s.placement_key === ad.placement)
      );
      if (matched) {
        resolvedSlotId = matched.id;
      } else {
        // Fallback to News Page Advertisement UUID: 60b54e3d-cf48-48a6-904f-f86ecf023c88
        resolvedSlotId = '60b54e3d-cf48-48a6-904f-f86ecf023c88';
      }
    }

    // Ensure valid URL format
    let destUrl = ad.destination_url.trim();
    if (!destUrl.startsWith('http://') && !destUrl.startsWith('https://')) {
      destUrl = `https://${destUrl}`;
    }

    // Parse and handle dates consistently
    let startAtIso = new Date().toISOString();
    if (ad.start_date) {
      // Check if format is DD-MM-YYYY
      const parts = ad.start_date.split('-');
      if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
        // DD-MM-YYYY
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`);
        if (!isNaN(d.getTime())) startAtIso = d.toISOString();
      } else {
        const d = new Date(ad.start_date);
        if (!isNaN(d.getTime())) startAtIso = d.toISOString();
      }
    }

    let endAtIso: string | null = null;
    if (ad.end_date && ad.end_date.trim()) {
      const parts = ad.end_date.trim().split('-');
      if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59.999Z`);
        if (!isNaN(d.getTime())) endAtIso = d.toISOString();
      } else {
        const d = new Date(ad.end_date.trim());
        if (!isNaN(d.getTime())) endAtIso = d.toISOString();
      }
    }

    const payload: any = {
      name: ad.name.trim(),
      advertiser_name: ad.advertiser.trim(),
      image_url: ad.image_url.trim(),
      image_alt: (ad.image_alt || ad.name).trim(),
      destination_url: destUrl,
      slot_id: resolvedSlotId,
      is_active: ad.is_active !== undefined ? Boolean(ad.is_active) : true,
      start_at: startAtIso,
      end_at: endAtIso,
      updated_at: new Date().toISOString(),
    };

    if (ad.id && isValidUUID(ad.id)) {
      payload.id = ad.id;
    }

    const { data, error } = await supabase
      .from('advertisements')
      .upsert(payload)
      .select('*, ad_slots(*)')
      .single();

    if (error) {
      console.error('Supabase saveAdvertisement error:', error);
      throw new Error(error.message || `Database error saving advertisement (${error.code || 'unknown'})`);
    }

    const saved = mapDbRowToCMSAdvertisement(data);
    notifySubscribers();
    return saved;
  },

  async deleteAdvertisement(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }
    await ensureAdminAuth();

    const { error } = await supabase.from('advertisements').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteAdvertisement error:', error);
      throw new Error(error.message || 'Failed to delete advertisement');
    }
    notifySubscribers();
  },

  // 5. THE FOUNDER MAGAZINE
  async getMagazineIssues(): Promise<CMSMagazineIssue[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      const cached = getCachedData<CMSMagazineIssue[]>(CACHE_KEY_ISSUES, memCachedIssues);
      return cached || [];
    }

    try {
      const { data, error } = await supabase
        .from('magazine_issues')
        .select('*')
        .order('published_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const cached = getCachedData<CMSMagazineIssue[]>(CACHE_KEY_ISSUES, memCachedIssues);
        return cached || [];
      }

      const mapped = data.map((d: any) => ({
        id: d.id,
        issue_number: d.issue_number,
        season: 'Winter 2026',
        title: d.title,
        dek: d.description || '',
        cover_image: d.cover_url || '',
        published_date: d.published_at || 'October 2026',
        theme: d.description || '',
        is_featured: Boolean(d.is_featured),
        is_published: Boolean(d.is_published),
        pdf_link: d.pdf_url || '',
        page_count: d.total_pages || 16,
        featured_founders: [],
        table_of_contents: [],
        created_at: d.created_at,
        updated_at: d.updated_at,
      }));

      memCachedIssues = mapped;
      setCachedData(CACHE_KEY_ISSUES, mapped);
      return mapped;
    } catch {
      const cached = getCachedData<CMSMagazineIssue[]>(CACHE_KEY_ISSUES, memCachedIssues);
      return cached || [];
    }
  },

  async saveMagazineIssue(issue: CMSMagazineIssue): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    const payload: any = {
      issue_number: issue.issue_number,
      title: issue.title,
      slug: issue.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: issue.dek,
      cover_url: issue.cover_image,
      pdf_url: issue.pdf_link,
      total_pages: issue.page_count || 16,
      published_at: issue.published_date || new Date().toISOString(),
      is_published: issue.is_published,
      is_featured: issue.is_featured,
      updated_at: new Date().toISOString(),
    };
    if (issue.id && issue.id.includes('-') && issue.id.length > 30) {
      payload.id = issue.id;
    }

    await supabase.from('magazine_issues').upsert(payload);
    notifySubscribers();
  },

  async deleteMagazineIssue(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('magazine_issues').delete().eq('id', id);
    notifySubscribers();
  },

  // 6. AUTHORS & CATEGORIES
  async getAuthors(): Promise<CMSAuthor[]> {
    const fallbackAuthor: CMSAuthor = {
      id: 'a925a3a4-abd9-4ebb-8966-b5fed4592371',
      name: 'Arjun Sindhu',
      slug: 'arjun-sindhu',
      role: 'Founder & Editor-in-Chief',
      organization: 'Founder Bytes',
      bio: 'Arjun Sindhu covers high-growth venture capital, Indian digital economy policy, and macro business shifts.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      twitter: 'https://twitter.com/founderbytes',
      linkedin: 'https://linkedin.com/in/founderbytes',
      email: 'arjun@founderbytes.in',
      total_articles: 25,
    };

    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return [fallbackAuthor];

    try {
      const { data, error } = await supabase.from('authors').select('*').eq('is_active', true);
      if (error || !data || data.length === 0) return [fallbackAuthor];

      return data.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        role: a.designation || 'Founder & Editor-in-Chief',
        organization: 'Founder Bytes',
        bio: a.bio || '',
        avatar: a.photo_url || fallbackAuthor.avatar,
        twitter: 'https://twitter.com/founderbytes',
        linkedin: 'https://linkedin.com/company/founderbytes',
        email: a.email || 'arjun@founderbytes.in',
        total_articles: 25,
      }));
    } catch {
      return [fallbackAuthor];
    }
  },

  async saveAuthor(author: CMSAuthor): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('authors').upsert({
      id: author.id.includes('-') && author.id.length > 30 ? author.id : undefined,
      name: author.name,
      slug: author.slug,
      designation: author.role,
      bio: author.bio,
      photo_url: author.avatar,
      email: author.email,
      is_active: true,
      updated_at: new Date().toISOString(),
    });
    notifySubscribers();
  },

  async getCategories(): Promise<CMSCategory[]> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data) return [];

      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        display_order: c.display_order || 0,
        is_visible: c.is_active ?? true,
      }));
    } catch {
      return [];
    }
  },

  async saveCategory(category: CMSCategory): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    const payload: any = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      display_order: category.display_order,
      is_active: category.is_visible,
      updated_at: new Date().toISOString(),
    };
    if (category.id && category.id.includes('-') && category.id.length > 30) {
      payload.id = category.id;
    }

    await supabase.from('categories').upsert(payload);
    notifySubscribers();
  },

  async deleteCategory(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('categories').delete().eq('id', id);
    notifySubscribers();
  },

  // 7. SITE SETTINGS
  async getSettings(): Promise<CMSSiteSettings> {
    const defaults: CMSSiteSettings = {
      site_name: 'FOUNDER BYTES',
      tagline: 'India’s Business & Startup Magazine',
      contact_email: 'desk@founderbytes.in',
      tips_email: 'tips@founderbytes.in',
      social_twitter: 'https://x.com/founderbytes',
      social_linkedin: 'https://linkedin.com/company/founderbytes',
      social_instagram: 'https://instagram.com/founderbytes',
      social_youtube: 'https://youtube.com/@founderbytes',
      seo_default_title: 'FOUNDER BYTES — India’s Business & Startup Magazine',
      seo_default_description: 'India’s premier digital business, startup news, and founder intelligence publication.',
      footer_text: 'Business • Startups • Innovation • Technology • Founders',
      supabase_url: localStorage.getItem('fb_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '',
      supabase_anon_key: localStorage.getItem('fb_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };

    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return defaults;

    try {
      const { data } = await supabase.from('site_settings').select('*');
      if (data && data.length > 0) {
        const merged = { ...defaults };
        data.forEach((row: any) => {
          if (row.setting_key && row.setting_value) {
            Object.assign(merged, row.setting_value);
          }
        });
        return merged;
      }
    } catch {
      // return defaults
    }

    return defaults;
  },

  async saveSettings(settings: CMSSiteSettings): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return;
    await ensureAdminAuth();

    await supabase.from('site_settings').upsert({
      setting_key: 'general_settings',
      setting_value: settings,
      updated_at: new Date().toISOString(),
    });
    notifySubscribers();
  },
};

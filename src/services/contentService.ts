import { 
  CMSArticle, 
  CMSSection, 
  CMSBreakingNews, 
  CMSAdvertisement, 
  CMSMagazineIssue, 
  CMSAuthor, 
  CMSCategory, 
  CMSSiteSettings,
  RealtimeStatus,
  AdPageType
} from '../types/cms';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { ARTICLES, AUTHORS, BREAKING_NEWS_ITEMS, CURRENT_MAGAZINE_ISSUE, CATEGORIES } from '../data/mockData';

// Storage keys for persistent caching and local fallback
const STORAGE_KEYS = {
  ARTICLES: 'fb_cms_articles',
  SECTIONS: 'fb_cms_sections',
  BREAKING_NEWS: 'fb_cms_breaking_news',
  ADS: 'fb_cms_ads',
  MAGAZINE: 'fb_cms_magazine',
  AUTHORS: 'fb_cms_authors',
  CATEGORIES: 'fb_cms_categories',
  SETTINGS: 'fb_cms_settings',
};

// Initial default sections for homepage builder (all completely customizable and reorderable via CMS)
const DEFAULT_SECTIONS: CMSSection[] = [
  {
    id: 'sec-hero',
    name: 'Top News Lead & Desk Wire',
    slug: 'main-hero',
    section_type: 'hero',
    description: 'Main editorial hero story plus top developments wire',
    display_order: 1,
    is_visible: true,
    story_count: 5,
    layout_type: 'startup-split',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-wire-trending',
    name: 'Latest News Wire & Trending Stories',
    slug: 'latest-trending',
    section_type: 'wire-trending',
    description: 'Real-time timestamped news feed paired with numbered trending stories',
    display_order: 2,
    is_visible: true,
    story_count: 5,
    layout_type: 'startup-split',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-startups',
    name: 'Startup News & Unit Economics',
    slug: 'startups',
    section_type: 'category',
    category_slug: 'startups',
    description: 'Venture scaling, operating models, and unit economics',
    display_order: 3,
    is_visible: true,
    story_count: 4,
    layout_type: 'startup-split',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-business',
    name: 'Business, Banking & Enterprise Economy',
    slug: 'business',
    section_type: 'category',
    category_slug: 'business',
    description: 'Macro corporate developments, RBI policy, and enterprise growth',
    display_order: 4,
    is_visible: true,
    story_count: 3,
    layout_type: 'grid-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-tech',
    name: 'Technology, Semiconductors & AI',
    slug: 'tech',
    section_type: 'category',
    category_slug: 'tech',
    description: 'Deeptech engineering, silicon fabrication, and sovereign models',
    display_order: 5,
    is_visible: true,
    story_count: 3,
    layout_type: 'tech-grid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-funding',
    name: 'Venture Capital & Deal Flow',
    slug: 'funding',
    section_type: 'category',
    category_slug: 'funding',
    description: 'Audited funding rounds and institutional syndicates',
    display_order: 6,
    is_visible: true,
    story_count: 3,
    layout_type: 'funding-table',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-founders',
    name: 'Founders & Builders',
    slug: 'founders',
    section_type: 'category',
    category_slug: 'founders',
    description: 'Exclusive on-site interviews, field visits, and founder profiles',
    display_order: 7,
    is_visible: true,
    story_count: 3,
    layout_type: 'founders-mosaic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sec-magazine',
    name: 'The Founder Magazine Quarterly Showcase',
    slug: 'the-founder-magazine',
    section_type: 'magazine',
    description: 'Showcase of current print & digital quarterly edition with digital flipbook',
    display_order: 8,
    is_visible: true,
    story_count: 1,
    layout_type: 'horizontal-list',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial advertisements matching page-specific slots
const DEFAULT_ADS: CMSAdvertisement[] = [
  {
    id: 'ad-startups-1',
    name: 'Karnataka Digital Economy Mission - Innovate in Bengaluru',
    advertiser: 'KDEM Bengaluru',
    image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    destination_url: 'https://founderbytes.in',
    page: 'startups',
    placement: 'startups-primary',
    ad_type: 'banner',
    start_date: new Date(Date.now() - 86400000).toISOString(),
    is_active: true,
  },
  {
    id: 'ad-business-1',
    name: 'India Global Innovation Summit 2026',
    advertiser: 'FICCI Tech Forum',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    destination_url: 'https://founderbytes.in',
    page: 'business',
    placement: 'business-primary',
    ad_type: 'banner',
    start_date: new Date(Date.now() - 86400000).toISOString(),
    is_active: true,
  },
  {
    id: 'ad-news-1',
    name: 'National DeepTech Capital Initiative',
    advertiser: 'MeitY Innovation Hub',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    destination_url: 'https://founderbytes.in',
    page: 'news',
    placement: 'news-primary',
    ad_type: 'banner',
    start_date: new Date(Date.now() - 86400000).toISOString(),
    is_active: true,
  },
];

// In-memory subscribers
type ContentListener = () => void;
type StatusListener = (status: RealtimeStatus) => void;
const listeners = new Set<ContentListener>();
const statusListeners = new Set<StatusListener>();

let currentRealtimeStatus: RealtimeStatus = 'LOCAL';
let broadcastChannel: BroadcastChannel | null = null;
let realtimeChannel: any = null;

// Initialize cross-tab broadcast channel
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('fb_realtime_bus');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'CONTENT_CHANGED') {
        notifySubscribersLocalOnly();
      }
    };
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('fb_cms_')) {
        notifySubscribersLocalOnly();
      }
    });
  }
} catch {
  // Graceful fallback for non-supporting environments
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

    // Subscribe to all public tables required by the publication
    const tables = [
      'articles',
      'article_blocks',
      'sections',
      'homepage_section_items',
      'breaking_news',
      'advertisements',
      'ad_slots',
      'magazine_issues',
      'magazine_stories',
      'categories',
      'authors',
      'site_settings'
    ];

    tables.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          // Invalidate affected data and notify public site immediately
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

// Auto-initialize realtime when this module is evaluated
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initSupabaseRealtime();
  }, 100);
}

// Main Content Service
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

  // Storage Upload to Supabase Storage
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
        } else if (error) {
          console.warn(`Supabase Storage upload warning (${bucket}):`, error.message);
        }
      } catch (err) {
        console.warn('Supabase storage upload error:', err);
      }
    }

    // High-fidelity local persistent fallback (converts to optimized dataURL so preview & render are instant)
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

  // Helper to map Mock Article into CMSArticle format
  mapMockToCMS(art: any): CMSArticle {
    return {
      id: art.id,
      slug: art.slug,
      title: art.title,
      subtitle: art.dek,
      category_id: `cat-${art.categorySlug}`,
      category_name: art.category,
      category_slug: art.categorySlug,
      sub_category: art.subCategory,
      author_id: 'author-arjun-sindhu',
      author_name: 'Arjun Sindhu',
      author_role: 'Founder & Editor-in-Chief',
      author_avatar: AUTHORS['arjun-sindhu'].avatar,
      featured_image: art.featuredImage,
      image_caption: art.imageCaption,
      image_credit: art.imageCredit,
      content_blocks: art.content.map((p: string, i: number) => ({
        id: `block-${art.id}-${i}`,
        block_type: 'paragraph' as const,
        position: i,
        content: p,
      })),
      raw_paragraphs: art.content,
      status: (art.status as any) || 'published',
      published_at: art.publishedAt,
      reading_time_minutes: art.readingTimeMinutes,
      tags: art.tags || [],
      source_name: art.sources?.[0]?.name,
      source_url: art.sources?.[0]?.url,
      is_featured: Boolean(art.isLeadHero),
      is_trending: Boolean(art.isTrending),
      is_breaking: false,
      is_editor_pick: Boolean(art.isEditorPick),
      priority: art.isLeadHero ? 100 : 0,
      seo_title: art.seoTitle || art.title,
      seo_description: art.seoDescription || art.dek,
    };
  },

  // 1. ARTICLES
  async getArticles(filter?: {
    category?: string;
    status?: string;
    is_featured?: boolean;
    is_trending?: boolean;
    limit?: number;
  }): Promise<CMSArticle[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        let query = supabase.from('articles').select('*');
        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }
        if (filter?.category && filter.category !== 'all') {
          query = query.eq('category_slug', filter.category);
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
        if (!error && data && data.length > 0) {
          const mapped: CMSArticle[] = data.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            subtitle: d.subtitle,
            category_id: d.category_id || '',
            category_name: d.category_name,
            category_slug: d.category_slug,
            sub_category: d.sub_category,
            author_id: d.author_id || 'author-arjun-sindhu',
            author_name: d.author_name || 'Arjun Sindhu',
            author_role: d.author_role || 'Founder & Editor-in-Chief',
            author_avatar: d.author_avatar || AUTHORS['arjun-sindhu'].avatar,
            featured_image: d.featured_image,
            image_caption: d.image_caption,
            image_credit: d.image_credit,
            content_blocks: d.content_blocks || [],
            raw_paragraphs: Array.isArray(d.raw_paragraphs) ? d.raw_paragraphs : [],
            status: d.status || 'published',
            published_at: d.published_at || new Date().toISOString(),
            reading_time_minutes: d.reading_time_minutes || 5,
            tags: d.tags || [],
            source_name: d.source_name,
            source_url: d.source_url,
            is_featured: Boolean(d.is_featured),
            is_trending: Boolean(d.is_trending),
            is_breaking: Boolean(d.is_breaking),
            is_editor_pick: Boolean(d.is_editor_pick),
            priority: d.priority || 0,
            seo_title: d.seo_title,
            seo_description: d.seo_description,
            quote_text: d.quote_text,
            quote_author: d.quote_author,
            is_sponsored: Boolean(d.is_sponsored),
            sponsor_name: d.sponsor_name,
          }));

          // Merge any verified default articles not yet in Supabase
          for (const art of ARTICLES) {
            if (!mapped.some((m) => m.slug === art.slug || m.id === art.id)) {
              const cmsArt = this.mapMockToCMS(art);
              mapped.push(cmsArt);
              this.saveArticle(cmsArt).catch(() => {});
            }
          }

          mapped.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(mapped));
          
          let filteredMapped = mapped;
          if (filter?.status && filter.status !== 'all') {
            filteredMapped = filteredMapped.filter((a) => a.status === filter.status);
          }
          if (filter?.category && filter.category !== 'all') {
            filteredMapped = filteredMapped.filter((a) => a.category_slug === filter.category);
          }
          if (filter?.is_trending) {
            filteredMapped = filteredMapped.filter((a) => a.is_trending);
          }
          if (filter?.is_featured) {
            filteredMapped = filteredMapped.filter((a) => a.is_featured);
          }
          if (filter?.limit) {
            filteredMapped = filteredMapped.slice(0, filter.limit);
          }
          return filteredMapped;
        }
      } catch (err) {
        console.warn('Supabase getArticles error, using local storage:', err);
      }
    }

    // Local Storage Fallback
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    let all: CMSArticle[] = [];
    if (!stored) {
      all = ARTICLES.map((art) => this.mapMockToCMS(art));
      all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(all));
    } else {
      try {
        all = JSON.parse(stored);
        let updated = false;
        for (const art of ARTICLES) {
          if (!all.some((a) => a.id === art.id || a.slug === art.slug)) {
            all.push(this.mapMockToCMS(art));
            updated = true;
          }
        }
        all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        if (updated) {
          localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(all));
        }
      } catch {
        all = ARTICLES.map((art) => this.mapMockToCMS(art));
        all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      }
    }

    let filtered = all;
    if (filter?.status && filter.status !== 'all') {
      filtered = filtered.filter((a) => a.status === filter.status);
    }
    if (filter?.category && filter.category !== 'all') {
      filtered = filtered.filter((a) => a.category_slug === filter.category);
    }
    if (filter?.is_trending) {
      filtered = filtered.filter((a) => a.is_trending);
    }
    if (filter?.is_featured) {
      filtered = filtered.filter((a) => a.is_featured);
    }
    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  },

  async saveArticle(article: CMSArticle): Promise<CMSArticle> {
    const supabase = getSupabaseClient();
    const cleanArticle: CMSArticle = {
      ...article,
      author_id: 'author-arjun-sindhu',
      author_name: 'Arjun Sindhu',
      author_role: 'Founder & Editor-in-Chief',
      author_avatar: AUTHORS['arjun-sindhu'].avatar,
      updated_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured()) {
      try {
        const payload: any = {
          id: cleanArticle.id.includes('-') && cleanArticle.id.length > 30 ? cleanArticle.id : undefined,
          slug: cleanArticle.slug,
          title: cleanArticle.title,
          subtitle: cleanArticle.subtitle,
          category_slug: cleanArticle.category_slug,
          category_name: cleanArticle.category_name,
          sub_category: cleanArticle.sub_category,
          author_name: cleanArticle.author_name,
          author_role: cleanArticle.author_role,
          author_avatar: cleanArticle.author_avatar,
          featured_image: cleanArticle.featured_image,
          image_caption: cleanArticle.image_caption,
          image_credit: cleanArticle.image_credit,
          raw_paragraphs: cleanArticle.raw_paragraphs || [],
          status: cleanArticle.status,
          published_at: cleanArticle.published_at,
          reading_time_minutes: cleanArticle.reading_time_minutes || 5,
          tags: cleanArticle.tags || [],
          source_name: cleanArticle.source_name,
          source_url: cleanArticle.source_url,
          is_featured: cleanArticle.is_featured,
          is_trending: cleanArticle.is_trending,
          is_breaking: cleanArticle.is_breaking,
          is_editor_pick: cleanArticle.is_editor_pick,
          priority: cleanArticle.priority,
          seo_title: cleanArticle.seo_title,
          seo_description: cleanArticle.seo_description,
          quote_text: cleanArticle.quote_text,
          quote_author: cleanArticle.quote_author,
          is_sponsored: cleanArticle.is_sponsored,
          sponsor_name: cleanArticle.sponsor_name,
          updated_at: cleanArticle.updated_at,
        };

        const { data, error } = await supabase.from('articles').upsert(payload).select().single();
        if (!error && data) {
          cleanArticle.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase saveArticle error:', err);
      }
    }

    // Local storage sync
    const current = await this.getArticles();
    const idx = current.findIndex((a) => a.id === cleanArticle.id || a.slug === cleanArticle.slug);
    if (idx >= 0) {
      current[idx] = cleanArticle;
    } else {
      current.unshift(cleanArticle);
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(current));
    notifySubscribers();
    return cleanArticle;
  },

  async deleteArticle(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteArticle error:', err);
      }
    }

    const current = await this.getArticles();
    const filtered = current.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered));
    notifySubscribers();
  },

  // 2. DYNAMIC HOMEPAGE SECTIONS
  async getSections(): Promise<CMSSection[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            section_type: d.section_type || 'category',
            description: d.description,
            display_order: d.display_order,
            is_visible: d.is_visible,
            story_count: d.story_count || 4,
            layout_type: d.layout_type || 'grid-3',
            category_slug: d.category_slug,
            created_at: d.created_at,
            updated_at: d.updated_at,
          }));
          localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getSections error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(DEFAULT_SECTIONS));
      return DEFAULT_SECTIONS;
    }
    try {
      const parsed: CMSSection[] = JSON.parse(stored);
      return parsed.sort((a, b) => a.display_order - b.display_order);
    } catch {
      return DEFAULT_SECTIONS;
    }
  },

  async saveSection(section: CMSSection): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('sections').upsert({
          id: section.id.includes('-') && section.id.length > 30 ? section.id : undefined,
          name: section.name,
          slug: section.slug,
          section_type: section.section_type,
          description: section.description,
          display_order: section.display_order,
          is_visible: section.is_visible,
          story_count: section.story_count,
          layout_type: section.layout_type,
          category_slug: section.category_slug,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase saveSection error:', err);
      }
    }

    const sections = await this.getSections();
    const idx = sections.findIndex((s) => s.id === section.id);
    if (idx >= 0) {
      sections[idx] = section;
    } else {
      sections.push(section);
    }
    sections.sort((a, b) => a.display_order - b.display_order);
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    notifySubscribers();
  },

  async reorderSections(orderedIds: string[]): Promise<void> {
    const sections = await this.getSections();
    const updated = sections.map((sec) => {
      const newIndex = orderedIds.indexOf(sec.id);
      return {
        ...sec,
        display_order: newIndex >= 0 ? newIndex + 1 : sec.display_order,
        updated_at: new Date().toISOString(),
      };
    });
    updated.sort((a, b) => a.display_order - b.display_order);

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await Promise.all(
          updated.map((s) =>
            supabase
              .from('sections')
              .update({ display_order: s.display_order, updated_at: s.updated_at })
              .eq('slug', s.slug)
          )
        );
      } catch (err) {
        console.warn('Supabase reorderSections error:', err);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(updated));
    notifySubscribers();
  },

  async deleteSection(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('sections').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteSection error:', err);
      }
    }

    const sections = await this.getSections();
    const filtered = sections.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(filtered));
    notifySubscribers();
  },

  // 3. BREAKING NEWS ALERTS
  async getBreakingNews(): Promise<CMSBreakingNews[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('breaking_news')
          .select('*')
          .order('priority', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: CMSBreakingNews[] = data.map((d: any) => ({
            id: d.id,
            headline: d.headline,
            link: d.link,
            is_active: d.is_active,
            priority: d.priority || 0,
            start_date: d.start_date,
            end_date: d.end_date,
            display_order: d.display_order || d.priority || 0,
            created_at: d.created_at,
          }));
          localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getBreakingNews error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.BREAKING_NEWS);
    if (!stored) {
      const initial: CMSBreakingNews[] = BREAKING_NEWS_ITEMS.map((item, i) => ({
        id: item.id,
        headline: item.headline,
        link: item.slug ? `/${item.slug}` : '#',
        is_active: true,
        priority: 10 - i,
        display_order: i + 1,
        created_at: item.timestamp,
      }));
      localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  async saveBreakingNews(item: CMSBreakingNews): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('breaking_news').upsert({
          id: item.id.includes('-') && item.id.length > 30 ? item.id : undefined,
          headline: item.headline,
          link: item.link,
          is_active: item.is_active,
          priority: item.priority || 0,
        });
      } catch (err) {
        console.warn('Supabase saveBreakingNews error:', err);
      }
    }

    const items = await this.getBreakingNews();
    const idx = items.findIndex((b) => b.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(items));
    notifySubscribers();
  },

  async deleteBreakingNews(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('breaking_news').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteBreakingNews error:', err);
      }
    }

    const items = await this.getBreakingNews();
    const filtered = items.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(filtered));
    notifySubscribers();
  },

  // 4. ADVERTISEMENTS & COMMERCIAL SLOTS
  async getAdvertisements(placement?: string, page?: AdPageType | string): Promise<CMSAdvertisement[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        let query = supabase.from('advertisements').select('*');
        if (placement) {
          query = query.eq('placement', placement);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const mapped: CMSAdvertisement[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            advertiser: d.advertiser,
            image_url: d.image_url,
            destination_url: d.destination_url,
            ad_type: d.ad_type || 'banner',
            page: d.page || 'all',
            placement: d.placement,
            start_date: d.start_date,
            end_date: d.end_date,
            is_active: d.is_active,
            created_at: d.created_at,
          }));
          localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(mapped));
          
          let results = mapped;
          if (page && page !== 'all') {
            results = results.filter((a) => a.page === page || a.page === 'all');
          }
          return results;
        }
      } catch (err) {
        console.warn('Supabase getAdvertisements error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.ADS);
    let all: CMSAdvertisement[] = [];
    if (!stored) {
      all = DEFAULT_ADS;
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(all));
    } else {
      try {
        all = JSON.parse(stored);
      } catch {
        all = DEFAULT_ADS;
      }
    }

    let results = all;
    if (placement) {
      results = results.filter((a) => a.placement === placement);
    }
    if (page && page !== 'all') {
      results = results.filter((a) => a.page === page || a.page === 'all');
    }
    return results;
  },

  async saveAdvertisement(ad: CMSAdvertisement): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('advertisements').upsert({
          id: ad.id.includes('-') && ad.id.length > 30 ? ad.id : undefined,
          name: ad.name,
          advertiser: ad.advertiser,
          image_url: ad.image_url,
          destination_url: ad.destination_url,
          ad_type: ad.ad_type || 'banner',
          placement: ad.placement,
          start_date: ad.start_date,
          end_date: ad.end_date,
          is_active: ad.is_active,
        });
      } catch (err) {
        console.warn('Supabase saveAdvertisement error:', err);
      }
    }

    const ads = await this.getAdvertisements();
    const idx = ads.findIndex((a) => a.id === ad.id);
    if (idx >= 0) {
      ads[idx] = ad;
    } else {
      ads.unshift(ad);
    }
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
    notifySubscribers();
  },

  async deleteAdvertisement(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('advertisements').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteAdvertisement error:', err);
      }
    }

    const ads = await this.getAdvertisements();
    const filtered = ads.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(filtered));
    notifySubscribers();
  },

  // 5. THE FOUNDER MAGAZINE
  async getMagazineIssues(): Promise<CMSMagazineIssue[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('magazine_issues')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: CMSMagazineIssue[] = data.map((d: any) => ({
            id: d.id,
            issue_number: d.issue_number,
            season: d.season,
            title: d.title,
            dek: d.dek,
            cover_image: d.cover_image,
            published_date: d.published_date,
            theme: d.theme,
            is_featured: d.is_featured,
            is_published: d.is_published,
            pdf_link: d.pdf_link,
            featured_founders: d.featured_founders || [],
            table_of_contents: d.table_of_contents || [],
            created_at: d.created_at,
            updated_at: d.updated_at,
          }));
          localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getMagazineIssues error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.MAGAZINE);
    if (!stored) {
      const initial: CMSMagazineIssue[] = [{
        id: 'issue-01',
        issue_number: CURRENT_MAGAZINE_ISSUE.issueNumber,
        season: CURRENT_MAGAZINE_ISSUE.season,
        title: CURRENT_MAGAZINE_ISSUE.title,
        dek: CURRENT_MAGAZINE_ISSUE.dek,
        cover_image: CURRENT_MAGAZINE_ISSUE.coverImage,
        published_date: CURRENT_MAGAZINE_ISSUE.publishedDate,
        theme: CURRENT_MAGAZINE_ISSUE.theme,
        is_featured: true,
        is_published: true,
        featured_founders: CURRENT_MAGAZINE_ISSUE.featuredFounders,
        table_of_contents: CURRENT_MAGAZINE_ISSUE.tableOfContents,
        page_count: 16,
      }];
      localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  async saveMagazineIssue(issue: CMSMagazineIssue): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('magazine_issues').upsert({
          id: issue.id.includes('-') && issue.id.length > 30 ? issue.id : undefined,
          issue_number: issue.issue_number,
          season: issue.season,
          title: issue.title,
          dek: issue.dek,
          cover_image: issue.cover_image,
          published_date: issue.published_date,
          theme: issue.theme,
          is_featured: issue.is_featured,
          is_published: issue.is_published,
          pdf_link: issue.pdf_link,
          featured_founders: issue.featured_founders,
          table_of_contents: issue.table_of_contents,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase saveMagazineIssue error:', err);
      }
    }

    const issues = await this.getMagazineIssues();
    const idx = issues.findIndex((i) => i.id === issue.id);
    if (idx >= 0) {
      issues[idx] = issue;
    } else {
      issues.unshift(issue);
    }
    localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(issues));
    notifySubscribers();
  },

  async deleteMagazineIssue(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('magazine_issues').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteMagazineIssue error:', err);
      }
    }

    const issues = await this.getMagazineIssues();
    const filtered = issues.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MAGAZINE, JSON.stringify(filtered));
    notifySubscribers();
  },

  // 6. AUTHORS & CATEGORIES (ARJUN SINDHU ONLY as requested)
  async getAuthors(): Promise<CMSAuthor[]> {
    const soleAuthor: CMSAuthor = {
      id: 'author-arjun-sindhu',
      name: 'Arjun Sindhu',
      slug: 'arjun-sindhu',
      role: 'Founder & Editor-in-Chief',
      organization: 'Founder Bytes',
      bio: 'Arjun Sindhu covers high-growth venture capital, Indian digital economy policy, and macro business shifts.',
      avatar: AUTHORS['arjun-sindhu'].avatar,
      twitter: 'https://twitter.com/founderbytes',
      linkedin: 'https://linkedin.com/in/founderbytes',
      email: 'arjun@founderbytes.in',
      total_articles: 142,
    };

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('authors').select('*');
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            name: a.name,
            slug: a.slug,
            role: a.role,
            organization: a.organization,
            bio: a.bio,
            avatar: a.avatar,
            twitter: a.twitter,
            linkedin: a.linkedin,
            email: a.email,
          }));
        }
      } catch (err) {
        console.warn('Supabase getAuthors error:', err);
      }
    }

    // Always offer Arjun Sindhu as the sole authorized author
    return [soleAuthor];
  },

  async saveAuthor(author: CMSAuthor): Promise<void> {
    const authors = await this.getAuthors();
    const idx = authors.findIndex((a) => a.id === author.id);
    if (idx >= 0) {
      authors[idx] = author;
    } else {
      authors.push(author);
    }
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
    notifySubscribers();
  },

  async getCategories(): Promise<CMSCategory[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            display_order: c.display_order || 0,
            is_visible: c.is_visible ?? true,
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) {
      const initial = CATEGORIES.map((c, i) => ({
        id: `cat-${c.slug}`,
        name: c.name,
        slug: c.slug,
        description: c.description,
        display_order: i + 1,
        is_visible: true,
      }));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  async saveCategory(category: CMSCategory): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').upsert({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          display_order: category.display_order,
          is_visible: category.is_visible,
        });
      } catch (err) {
        console.warn('Supabase saveCategory error:', err);
      }
    }
    const categories = await this.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifySubscribers();
  },

  async deleteCategory(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCategory error:', err);
      }
    }
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
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
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
        if (!error && data) {
          return { ...defaults, ...data };
        }
      } catch (err) {
        console.warn('Supabase getSettings error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) return defaults;
    try {
      return { ...defaults, ...JSON.parse(stored) };
    } catch {
      return defaults;
    }
  },

  async saveSettings(settings: CMSSiteSettings): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert({
          id: 1,
          site_name: settings.site_name,
          tagline: settings.tagline,
          contact_email: settings.contact_email,
          tips_email: settings.tips_email,
          social_twitter: settings.social_twitter,
          social_linkedin: settings.social_linkedin,
          social_instagram: settings.social_instagram,
          social_youtube: settings.social_youtube,
          seo_default_title: settings.seo_default_title,
          seo_default_description: settings.seo_default_description,
          footer_text: settings.footer_text,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase saveSettings error:', err);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifySubscribers();
  },
};

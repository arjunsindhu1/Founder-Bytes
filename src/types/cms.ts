export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'unpublished' | 'archived';

export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'subheading' 
  | 'image' 
  | 'quote' 
  | 'callout' 
  | 'list' 
  | 'divider' 
  | 'related_story'
  | 'video'
  | 'embed';

export interface ArticleBlock {
  id: string;
  article_id?: string;
  block_type: BlockType;
  position: number;
  content: string;
  image_url?: string;
  image_alt?: string;
  image_caption?: string;
  image_credit?: string;
  attribution?: string; // for quotes
  metadata?: Record<string, any>;
}

export interface CMSArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  sub_category?: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  featured_image: string;
  image_caption?: string;
  image_credit?: string;
  featured_image_alt?: string;
  featured_image_source_url?: string;
  article_body?: string; // Unified full-article rich-text HTML
  content_blocks: ArticleBlock[];
  raw_paragraphs: string[]; // fallback / quick reader format
  status: ArticleStatus;
  published_at: string; // ISO string
  updated_at?: string;
  scheduled_at?: string | null;
  reading_time_minutes: number;
  tags: string[];
  source_name?: string;
  source_url?: string;
  source_type?: string;
  location?: string;
  article_type?: string;
  is_featured: boolean;
  is_trending: boolean;
  is_breaking: boolean;
  is_editor_pick: boolean;
  priority: number;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  canonical_url?: string;
  robots_meta?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_type?: 'NewsArticle' | 'Article';
  entities?: {
    people?: string[];
    companies?: string[];
    organizations?: string[];
    places?: string[];
    products_or_books?: string[];
    topics?: string[];
  };
  quote_text?: string;
  quote_author?: string;
  is_sponsored?: boolean;
  sponsor_name?: string;
  created_at?: string;
}

export type SectionLayoutType = 
  | 'startup-split' 
  | 'market-dense' 
  | 'founders-mosaic' 
  | 'tech-grid' 
  | 'funding-table' 
  | 'grid-3' 
  | 'horizontal-list';

export interface CMSSection {
  id: string;
  name: string;
  slug: string;
  section_type: string;
  description?: string;
  display_order: number;
  is_visible: boolean;
  story_count: number;
  layout_type: SectionLayoutType;
  category_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_visible: boolean;
}

export interface CMSAuthor {
  id: string;
  name: string;
  slug: string;
  role: string;
  organization: string;
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  total_articles?: number;
}

export interface CMSMagazineIssue {
  id: string;
  issue_number: string;
  season: string;
  title: string;
  dek: string;
  cover_image: string;
  published_date: string;
  theme: string;
  is_featured: boolean;
  is_published: boolean;
  pdf_link?: string;
  pdf_file_name?: string;
  pdf_size_bytes?: number;
  page_count?: number;
  featured_founders: {
    name: string;
    company: string;
    valuationOrMetric: string;
    storyHeadline: string;
    slug: string;
    avatar?: string;
  }[];
  table_of_contents: {
    section: string;
    title: string;
    author: string;
    page: string;
  }[];
  digital_pages?: {
    pageNumber: number;
    title: string;
    subtitle?: string;
    type: 'cover' | 'editorial' | 'feature' | 'profile' | 'gallery' | 'back';
    imageUrl?: string;
    content?: string[];
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface CMSBreakingNews {
  id: string;
  headline: string;
  link: string;
  is_active: boolean;
  priority: number;
  start_date?: string;
  end_date?: string;
  display_order?: number;
  time_display?: string;
  created_at: string;
}

export type AdPageType = 
  | 'all' 
  | 'home' 
  | 'news' 
  | 'startups' 
  | 'business' 
  | 'technology' 
  | 'ai' 
  | 'founders' 
  | 'funding' 
  | 'markets' 
  | 'innovation' 
  | 'magazine' 
  | 'article';

export interface CMSAdSlot {
  id: string;
  slot_name: string;
  page_type: string;
  placement_key: string;
  description?: string;
  width: number;
  height: number;
  recommended_width?: number;
  recommended_height?: number;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CMSAdvertisement {
  id: string;
  name: string;
  advertiser: string;
  image_url: string;
  image_alt?: string;
  image_width?: number;
  image_height?: number;
  destination_url: string;
  slot_id?: string;
  page: AdPageType | string;
  placement: string;
  ad_type?: 'banner' | 'medium-rectangle' | 'responsive';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSSiteSettings {
  site_name: string;
  tagline: string;
  contact_email: string;
  tips_email: string;
  social_twitter: string;
  social_linkedin: string;
  social_instagram: string;
  social_youtube: string;
  seo_default_title: string;
  seo_default_description: string;
  footer_text: string;
  supabase_url?: string;
  supabase_anon_key?: string;
}

export type RealtimeStatus = 'LIVE' | 'CONNECTING' | 'RECONNECTING' | 'LOCAL';

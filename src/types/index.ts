export interface ArticleSource {
  name: string;
  url?: string;
  type: 'original' | 'filing' | 'announcement' | 'wire' | 'verified_secondary';
}

export interface Author {
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
  totalArticles: number;
}

export type CategorySlug = 
  | 'news' 
  | 'latest'
  | 'startups' 
  | 'business' 
  | 'technology' 
  | 'tech'
  | 'ai' 
  | 'founders' 
  | 'funding' 
  | 'markets'
  | 'companies' 
  | 'innovation' 
  | 'interviews' 
  | 'magazine';

export interface Category {
  name: string;
  slug: CategorySlug;
  description: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  dek: string;
  content: string[]; // HTML/paragraphs or structured sections
  category: string;
  categorySlug: CategorySlug;
  subCategory?: string;
  author: Author;
  authorId: string;
  featuredImage: string;
  imageCaption: string;
  imageCredit: string;
  publishedAt: string; // ISO string
  updatedAt?: string; // ISO string
  readingTimeMinutes: number;
  status: 'published' | 'draft';
  tags: string[];
  sources: ArticleSource[];
  isSponsored?: boolean;
  sponsorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl: string;
  isLeadHero?: boolean;
  isSecondaryHero?: boolean;
  isTrending?: boolean;
  isEditorPick?: boolean;
  pullQuote?: {
    text: string;
    attribution: string;
  };
}

export interface MagazineIssue {
  issueNumber: string; // e.g. "ISSUE 01"
  season: string; // e.g. "FALL 2026 EDITION"
  title: string;
  dek: string;
  coverImage: string;
  coverStorySlug: string;
  theme: string;
  publishedDate: string;
  featuredFounders: {
    name: string;
    company: string;
    valuationOrMetric: string;
    storyHeadline: string;
    slug: string;
  }[];
  tableOfContents: {
    section: string;
    title: string;
    author: string;
    page: string;
  }[];
}

export interface BreakingNewsItem {
  id: string;
  timestamp: string; // ISO or IST string
  timeDisplay: string; // e.g. "8:42 PM"
  headline: string;
  category: string;
  slug: string;
  isHighImpact?: boolean;
}

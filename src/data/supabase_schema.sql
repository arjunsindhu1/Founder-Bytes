-- ============================================================
-- FOUNDER BYTES — SUPABASE RELATIONAL CMS DATABASE SCHEMA
-- Execute this script in your Supabase Project SQL Editor
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Authors Table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT 'Founder Bytes',
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  twitter TEXT,
  linkedin TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_slug TEXT NOT NULL,
  category_name TEXT NOT NULL,
  sub_category TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  image_caption TEXT,
  image_credit TEXT,
  raw_paragraphs JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'unpublished', 'archived')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time_minutes INT DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  source_name TEXT,
  source_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_editor_pick BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  quote_text TEXT,
  quote_author TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Article Content Blocks (Modular Editor)
CREATE TABLE IF NOT EXISTS article_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('paragraph', 'heading', 'subheading', 'image', 'quote', 'callout', 'list', 'divider', 'related_story')),
  position INT NOT NULL DEFAULT 0,
  content TEXT,
  image_url TEXT,
  image_caption TEXT,
  image_credit TEXT,
  attribution TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Dynamic Homepage Sections (CMS Homepage Builder)
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'category',
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  story_count INT DEFAULT 4,
  layout_type TEXT NOT NULL DEFAULT 'grid-3',
  category_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Breaking News Alerts
CREATE TABLE IF NOT EXISTS breaking_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Advertisements & Commercial Slots
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  advertiser TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  ad_type TEXT NOT NULL DEFAULT 'responsive',
  placement TEXT NOT NULL CHECK (placement IN ('top', 'between-ticker-hero', 'hero-sidebar', 'between-sections', 'article-top', 'article-middle', 'article-sidebar', 'article-bottom', 'magazine', 'footer')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. The Founder Magazine Issues
CREATE TABLE IF NOT EXISTS magazine_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_number TEXT NOT NULL,
  season TEXT NOT NULL,
  title TEXT NOT NULL,
  dek TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  published_date TEXT NOT NULL,
  theme TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  pdf_link TEXT,
  featured_founders JSONB DEFAULT '[]'::jsonb,
  table_of_contents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL DEFAULT 'FOUNDER BYTES',
  tagline TEXT NOT NULL DEFAULT 'India’s Business & Startup Magazine',
  contact_email TEXT NOT NULL DEFAULT 'desk@founderbytes.in',
  tips_email TEXT NOT NULL DEFAULT 'tips@founderbytes.in',
  social_twitter TEXT DEFAULT 'https://x.com/founderbytes',
  social_linkedin TEXT DEFAULT 'https://linkedin.com/company/founderbytes',
  social_instagram TEXT DEFAULT 'https://instagram.com/founderbytes',
  social_youtube TEXT DEFAULT 'https://youtube.com/@founderbytes',
  seo_default_title TEXT DEFAULT 'FOUNDER BYTES — India’s Business & Startup Magazine',
  seo_default_description TEXT DEFAULT 'India’s premier digital business, startup news, and founder intelligence publication.',
  footer_text TEXT DEFAULT 'India’s Business & Startup Magazine · founderbytes.in',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public READ policies (anyone can read published content)
CREATE POLICY "Public articles are readable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public sections are readable by everyone" ON sections FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Public categories are readable by everyone" ON categories FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "Public authors are readable by everyone" ON authors FOR SELECT USING (TRUE);
CREATE POLICY "Public breaking news are readable by everyone" ON breaking_news FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public ads are readable by everyone" ON advertisements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public magazine issues are readable by everyone" ON magazine_issues FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public blocks are readable by everyone" ON article_blocks FOR SELECT USING (TRUE);
CREATE POLICY "Public site settings are readable by everyone" ON site_settings FOR SELECT USING (TRUE);

-- Authenticated Admin FULL policies
CREATE POLICY "Admins have full access to articles" ON articles FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to sections" ON sections FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to categories" ON categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to authors" ON authors FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to breaking news" ON breaking_news FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to advertisements" ON advertisements FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to magazine issues" ON magazine_issues FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to article blocks" ON article_blocks FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to site settings" ON site_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- 11. Magazine Nominations Table
CREATE TABLE IF NOT EXISTS magazine_nominations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  magazine TEXT NOT NULL,
  nomination_type TEXT NOT NULL CHECK (nomination_type IN ('Myself', 'Someone Else')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state_country TEXT NOT NULL,
  linkedin TEXT,
  instagram TEXT,
  personal_website TEXT,
  company_name TEXT NOT NULL,
  company_website TEXT,
  designation TEXT NOT NULL,
  industry TEXT NOT NULL,
  year_founded TEXT,
  company_stage TEXT,
  team_size TEXT,
  story_nominee TEXT NOT NULL,
  standout_reason TEXT NOT NULL,
  key_achievements TEXT NOT NULL,
  biggest_impact TEXT NOT NULL,
  funding_status TEXT,
  funding_stage TEXT,
  total_funding TEXT,
  key_investors TEXT,
  feature_reason TEXT NOT NULL,
  profile_photo_url TEXT NOT NULL,
  supporting_docs_url TEXT,
  press_portfolio_url TEXT,
  nominator_name TEXT,
  nominator_email TEXT,
  nominator_relationship TEXT,
  nominator_reason TEXT,
  declaration_accurate BOOLEAN NOT NULL DEFAULT TRUE,
  declaration_no_guarantee BOOLEAN NOT NULL DEFAULT TRUE,
  declaration_contact_consent BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'ARCHIVED')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE magazine_nominations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public users can insert nominations only" ON magazine_nominations FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to magazine nominations" ON magazine_nominations FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- 12. Founder Spotlight Packages Table
CREATE TABLE IF NOT EXISTS founder_spotlight_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration_days INT NOT NULL DEFAULT 30,
  homepage_feature BOOLEAN NOT NULL DEFAULT TRUE,
  profile_included BOOLEAN NOT NULL DEFAULT TRUE,
  social_promotion BOOLEAN NOT NULL DEFAULT FALSE,
  magazine_consideration BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Founder Spotlights Table
CREATE TABLE IF NOT EXISTS founder_spotlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  founder_name TEXT NOT NULL,
  founder_photo TEXT NOT NULL,
  company_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  industry TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  founder_story TEXT NOT NULL,
  featured_quote TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  cta_text TEXT DEFAULT 'Learn More',
  cta_url TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  featured_position INT NOT NULL DEFAULT 1,
  package_id UUID REFERENCES founder_spotlight_packages(id) ON DELETE SET NULL,
  price NUMERIC,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Complimentary', 'Refunded')),
  admin_notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Scheduled', 'Live', 'Expired', 'Unpublished')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE founder_spotlight_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_spotlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active packages" ON founder_spotlight_packages FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "Public can view active live founder spotlights" ON founder_spotlights FOR SELECT TO anon, authenticated USING (status = 'Live' AND CURRENT_DATE >= start_date AND CURRENT_DATE <= end_date AND payment_status IN ('Paid', 'Complimentary'));
CREATE POLICY "Admins have full access to packages" ON founder_spotlight_packages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to founder spotlights" ON founder_spotlights FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);



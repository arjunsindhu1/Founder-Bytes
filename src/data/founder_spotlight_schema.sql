-- ============================================================
-- FOUNDER BYTES — FOUNDER SPOTLIGHT & PACKAGES SCHEMA
-- Execute in Supabase SQL Editor
-- ============================================================

-- 1. Founder Spotlight Packages Table
CREATE TABLE IF NOT EXISTS founder_spotlight_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 2. Founder Spotlights Table
CREATE TABLE IF NOT EXISTS founder_spotlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_founder_spotlights_slug ON founder_spotlights(slug);
CREATE INDEX IF NOT EXISTS idx_founder_spotlights_status ON founder_spotlights(status);
CREATE INDEX IF NOT EXISTS idx_founder_spotlights_dates ON founder_spotlights(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_founder_spotlights_position ON founder_spotlights(featured_position);

-- 4. Row Level Security (RLS)
ALTER TABLE founder_spotlight_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_spotlights ENABLE ROW LEVEL SECURITY;

-- 5. Public Read Policies
-- Public can read active packages
CREATE POLICY "Public can view active packages"
  ON founder_spotlight_packages
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Public can read ONLY Live, paid/complimentary founder spotlights during their active window
CREATE POLICY "Public can view active live founder spotlights"
  ON founder_spotlights
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'Live' 
    AND CURRENT_DATE >= start_date 
    AND CURRENT_DATE <= end_date
    AND payment_status IN ('Paid', 'Complimentary')
  );

-- 6. Authenticated Admin Full Privileges
CREATE POLICY "Admins have full access to packages"
  ON founder_spotlight_packages
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins have full access to founder spotlights"
  ON founder_spotlights
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- 7. Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE founder_spotlights;

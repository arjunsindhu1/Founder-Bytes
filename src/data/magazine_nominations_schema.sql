-- ============================================================
-- FOUNDER BYTES — MAGAZINE NOMINATIONS TABLE SCHEMA & SECURITY
-- Execute in Supabase SQL Editor
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS magazine_nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  magazine TEXT NOT NULL,
  nomination_type TEXT NOT NULL CHECK (nomination_type IN ('Myself', 'Someone Else')),
  
  -- Nominee details
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state_country TEXT NOT NULL,
  linkedin TEXT,
  instagram TEXT,
  personal_website TEXT,
  
  -- Business details
  company_name TEXT NOT NULL,
  company_website TEXT,
  designation TEXT NOT NULL,
  industry TEXT NOT NULL,
  year_founded TEXT,
  company_stage TEXT,
  team_size TEXT,
  
  -- Story & Impact
  story_nominee TEXT NOT NULL,
  standout_reason TEXT NOT NULL,
  key_achievements TEXT NOT NULL,
  biggest_impact TEXT NOT NULL,
  
  -- Funding details
  funding_status TEXT,
  funding_stage TEXT,
  total_funding TEXT,
  key_investors TEXT,
  
  -- Nomination Justification
  feature_reason TEXT NOT NULL,
  
  -- Supporting files
  profile_photo_url TEXT NOT NULL,
  supporting_docs_url TEXT,
  press_portfolio_url TEXT,
  
  -- Nominator info (if "Someone Else")
  nominator_name TEXT,
  nominator_email TEXT,
  nominator_relationship TEXT,
  nominator_reason TEXT,
  
  -- Declarations
  declaration_accurate BOOLEAN NOT NULL DEFAULT TRUE,
  declaration_no_guarantee BOOLEAN NOT NULL DEFAULT TRUE,
  declaration_contact_consent BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Status & Admin notes
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN (
    'NEW',
    'UNDER REVIEW',
    'SHORTLISTED',
    'INTERVIEW',
    'SELECTED',
    'REJECTED',
    'ARCHIVED'
  )),
  admin_notes TEXT DEFAULT '',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_magazine_nominations_magazine ON magazine_nominations(magazine);
CREATE INDEX IF NOT EXISTS idx_magazine_nominations_status ON magazine_nominations(status);
CREATE INDEX IF NOT EXISTS idx_magazine_nominations_created_at ON magazine_nominations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazine_nominations_reference_number ON magazine_nominations(reference_number);

-- 3. Row Level Security (RLS)
ALTER TABLE magazine_nominations ENABLE ROW LEVEL SECURITY;

-- 4. Public users can ONLY INSERT nominations
-- They CANNOT select, update, or delete.
CREATE POLICY "Public users can insert nominations only"
  ON magazine_nominations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- 5. Only authenticated admins can read, update, or delete nominations
CREATE POLICY "Admins have full access to magazine nominations"
  ON magazine_nominations
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- 6. Enable Realtime on magazine_nominations
ALTER PUBLICATION supabase_realtime ADD TABLE magazine_nominations;

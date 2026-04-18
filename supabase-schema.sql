-- Digital Heroes — Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════
-- USERS PROFILES (extends Supabase Auth)
-- ═══════════════════════════════════════════
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  avatar_url TEXT,
  handicap DECIMAL,
  charity_id UUID,
  charity_percentage INTEGER DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- SUBSCRIPTIONS
-- ═══════════════════════════════════════════
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'lapsed', 'expired')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- SCORES
-- ═══════════════════════════════════════════
CREATE TABLE scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)  -- Only one score per date per user
);

-- ═══════════════════════════════════════════
-- CHARITIES
-- ═══════════════════════════════════════════
CREATE TABLE charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  website TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- CHARITY EVENTS
-- ═══════════════════════════════════════════
CREATE TABLE charity_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for profiles.charity_id
ALTER TABLE profiles ADD CONSTRAINT fk_charity FOREIGN KEY (charity_id) REFERENCES charities(id) ON DELETE SET NULL;

-- ═══════════════════════════════════════════
-- DRAWS
-- ═══════════════════════════════════════════
CREATE TABLE draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'random' CHECK (type IN ('random', 'algorithmic')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'simulated', 'published')),
  winning_numbers INTEGER[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ═══════════════════════════════════════════
-- DRAW ENTRIES
-- ═══════════════════════════════════════════
CREATE TABLE draw_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scores_snapshot INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

-- ═══════════════════════════════════════════
-- PRIZE POOLS
-- ═══════════════════════════════════════════
CREATE TABLE prize_pools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  five_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  four_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  three_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  jackpot_rollover DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- WINNERS
-- ═══════════════════════════════════════════
CREATE TABLE winners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_type INTEGER NOT NULL CHECK (match_type IN (3, 4, 5)),
  prize_amount DECIMAL(10,2) NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_proof', 'approved', 'rejected', 'paid')),
  verified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- DONATIONS (Independent)
-- ═══════════════════════════════════════════
CREATE TABLE donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL DEFAULT 'subscription' CHECK (type IN ('subscription', 'independent')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Scores: Users can CRUD their own
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);

-- Charities: Public read
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);

-- Draws: Public read
CREATE POLICY "Anyone can view draws" ON draws FOR SELECT USING (true);

-- Draw entries: Users can view their own
CREATE POLICY "Users can view own entries" ON draw_entries FOR SELECT USING (auth.uid() = user_id);

-- Winners: Users can view their own
CREATE POLICY "Users can view own winnings" ON winners FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_draws_updated_at BEFORE UPDATE ON draws FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enforce max 5 scores per user
CREATE OR REPLACE FUNCTION enforce_max_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete oldest score if user already has 5
  IF (SELECT COUNT(*) FROM scores WHERE user_id = NEW.user_id) >= 5 THEN
    DELETE FROM scores WHERE id = (
      SELECT id FROM scores WHERE user_id = NEW.user_id ORDER BY date ASC LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_5_scores
  BEFORE INSERT ON scores
  FOR EACH ROW EXECUTE FUNCTION enforce_max_scores();

-- ═══════════════════════════════════════════
-- SEED DATA: CHARITIES
-- ═══════════════════════════════════════════
INSERT INTO charities (name, description, category, featured, website) VALUES
  ('Children''s Golf Foundation', 'Introducing golf to underprivileged children across the UK.', 'Youth Development', true, 'https://example.com/cgf'),
  ('Golf for Veterans', 'Supporting military veterans through therapeutic golf programmes.', 'Veterans Support', true, 'https://example.com/gfv'),
  ('Green Earth Initiative', 'Promoting environmental sustainability in golf course management.', 'Environment', false, 'https://example.com/gei'),
  ('Disability Golf Alliance', 'Making golf accessible to people with physical and learning disabilities.', 'Accessibility', true, 'https://example.com/dga'),
  ('Mental Health Through Sport', 'Using golf as a tool for mental health recovery.', 'Mental Health', false, 'https://example.com/mhts'),
  ('Community Links Trust', 'Building community golf spaces in urban areas.', 'Community', false, 'https://example.com/clt');

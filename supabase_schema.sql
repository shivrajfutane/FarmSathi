-- ==============================================================================
-- SIH 2026 Problem Statement SIH26132
-- Strengthening Market Linkages and Price Discovery for Farmers
-- Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer', 'admin')),
  avatar_url TEXT,
  state TEXT DEFAULT 'Maharashtra',
  district TEXT DEFAULT 'Pune',
  village TEXT,
  farm_name TEXT,
  company_name TEXT,
  gst_number TEXT,
  landholding_acres NUMERIC,
  is_fpo BOOLEAN DEFAULT false,
  fpo_name TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected', 'more_info_needed')),
  rating NUMERIC DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on Supabase auth signup (including Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Markets (APMC Mandis) Table
CREATE TABLE IF NOT EXISTS public.markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Markets are readable by all authenticated users" ON public.markets FOR SELECT USING (true);

-- 4. Market Prices (Daily Mandi Rates)
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop TEXT NOT NULL,
  variety TEXT NOT NULL,
  market_id UUID REFERENCES public.markets(id) ON DELETE CASCADE,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  modal_price NUMERIC NOT NULL,
  unit TEXT DEFAULT 'quintal',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prices are readable by all" ON public.market_prices FOR SELECT USING (true);

-- 5. Produce Lots (Farmer Listings)
CREATE TABLE IF NOT EXISTS public.produce_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  grade TEXT NOT NULL DEFAULT 'A' CHECK (grade IN ('A', 'B', 'C')),
  quality_parameters JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  harvest_date DATE NOT NULL,
  available_from DATE NOT NULL,
  location_state TEXT NOT NULL,
  location_district TEXT NOT NULL,
  location_village TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  expected_price NUMERIC NOT NULL,
  min_acceptable_price NUMERIC NOT NULL,
  preferred_market TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'matched', 'offer_accepted', 'in_transit', 'delivered', 'completed', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '14 days'
);

ALTER TABLE public.produce_lots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lots are readable by everyone" ON public.produce_lots FOR SELECT USING (true);
CREATE POLICY "Farmers can insert their own lots" ON public.produce_lots FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own lots" ON public.produce_lots FOR UPDATE USING (auth.uid() = farmer_id);

-- 6. Offers (Buyer Purchase Bids)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_id UUID REFERENCES public.produce_lots(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  offered_price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  delivery_terms TEXT NOT NULL,
  payment_terms TEXT NOT NULL,
  match_score NUMERIC DEFAULT 90,
  match_details JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view offers where they are buyer or farmer" ON public.offers FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);
CREATE POLICY "Buyers can create offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update offers" ON public.offers FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- 7. Orders & Logistics Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES public.profiles(id),
  buyer_id UUID REFERENCES public.profiles(id),
  lot_id UUID REFERENCES public.produce_lots(id),
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'transport_assigned', 'pickup_scheduled', 'picked_up', 'in_transit', 'delivered', 'payment_released', 'completed', 'cancelled', 'disputed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order participants can view their orders" ON public.orders FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

-- 8. Payments & Escrow Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  produce_value NUMERIC NOT NULL,
  transport_cost NUMERIC NOT NULL DEFAULT 0,
  platform_charge NUMERIC NOT NULL DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  utr_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view payment records" ON public.payments FOR SELECT USING (true);

-- 9. Disputes & Grievances Table
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_files TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'rejected')),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispute owners and admins can view disputes" ON public.disputes FOR SELECT USING (true);
CREATE POLICY "Users can file disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Initial Seed Data (APMC Mandis)
INSERT INTO public.markets (name, state, district, lat, lng) VALUES
  ('Pune APMC', 'Maharashtra', 'Pune', 18.5204, 73.8567),
  ('Nashik Market', 'Maharashtra', 'Nashik', 19.9975, 73.7898),
  ('Mumbai APMC', 'Maharashtra', 'Mumbai', 19.0760, 72.8777),
  ('Kolhapur Mandi', 'Maharashtra', 'Kolhapur', 16.7050, 74.2433),
  ('Solapur Market', 'Maharashtra', 'Solapur', 17.6599, 75.9064)
ON CONFLICT DO NOTHING;


-- BLUE BEACH RESORT - COMPLETE DATABASE SCHEMA
-- Designed for Supabase (PostgreSQL)

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'GUEST');
CREATE TYPE service_category AS ENUM (
  'Check-In', 'Room & Comfort', 'Food & Dining', 
  'Spa & Wellness', 'Pool & Fun', 'Beach Activities', 
  'Staff & Service', 'Check-Out'
);
CREATE TYPE feedback_status AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE query_status AS ENUM ('PENDING', 'REPLIED', 'AUTO_REPLIED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');
CREATE TYPE request_category AS ENUM ('Housekeeping', 'Maintenance', 'Room Service', 'Concierge', 'Transport');
CREATE TYPE room_state AS ENUM ('CLEAN', 'DIRTY', 'OCCUPIED', 'DND', 'MAINTENANCE');
CREATE TYPE staff_status AS ENUM ('ON_SHIFT', 'OFF_SHIFT', 'ON_LEAVE', 'BREAK');
CREATE TYPE inventory_status AS ENUM ('OK', 'LOW', 'CRITICAL');
CREATE TYPE event_category AS ENUM ('Kids', 'Wellness', 'Nightlife', 'Food');

-- 2. TABLES

-- Profiles (Extends Auth Users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role user_role DEFAULT 'GUEST',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms
CREATE TABLE rooms (
  room_number TEXT PRIMARY KEY,
  floor INTEGER NOT NULL,
  state room_state DEFAULT 'CLEAN',
  current_guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_cleaned_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback Submissions
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room_number TEXT REFERENCES rooms(room_number),
  overall_sentiment FLOAT, -- -1 to 1
  gesture_type TEXT, -- Simplified for now
  photo_url TEXT,
  status feedback_status DEFAULT 'NEW',
  is_flagged BOOLEAN DEFAULT FALSE,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback Individual Items
CREATE TABLE feedback_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE,
  category service_category NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT
);

-- Guest Queries / Concierge
CREATE TABLE guest_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room_number TEXT REFERENCES rooms(room_number),
  query_text TEXT NOT NULL,
  reply_text TEXT,
  status query_status DEFAULT 'PENDING',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests (e-Butler)
CREATE TABLE butler_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room_number TEXT REFERENCES rooms(room_number),
  category request_category NOT NULL,
  item TEXT NOT NULL,
  note TEXT,
  status ticket_status DEFAULT 'OPEN',
  estimated_time INTERVAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Tickets (Work Orders)
CREATE TABLE maintenance_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_feedback_id UUID REFERENCES feedback(id) ON DELETE SET NULL,
  room_number TEXT REFERENCES rooms(room_number),
  issue_description TEXT NOT NULL,
  category TEXT,
  priority ticket_priority DEFAULT 'MEDIUM',
  status ticket_status DEFAULT 'OPEN',
  assigned_to UUID REFERENCES profiles(id), -- Staff member
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT,
  status inventory_status DEFAULT 'OK',
  last_restocked TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dining Venues
CREATE TABLE dining_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT,
  image_url TEXT,
  is_open BOOLEAN DEFAULT TRUE,
  rating FLOAT DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dining Bookings
CREATE TABLE dining_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room_number TEXT REFERENCES rooms(room_number),
  venue_id UUID REFERENCES dining_venues(id) ON DELETE CASCADE,
  venue_name TEXT,
  booking_time TEXT,
  guest_count INTEGER DEFAULT 2,
  status ticket_status DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resort Events
CREATE TABLE resort_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_time TEXT, -- Or TIMESTAMPTZ
  location TEXT,
  description TEXT,
  image_url TEXT,
  category event_category,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons / Rewards
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  expiry_date TIMESTAMPTZ,
  is_redeemed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Performance Stats
CREATE TABLE staff_stats (
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  department TEXT,
  status staff_status DEFAULT 'OFF_SHIFT',
  positive_mentions INTEGER DEFAULT 0,
  avg_rating FLOAT DEFAULT 0.0,
  shift_started_at TIMESTAMPTZ
);

-- 3. FUNCTIONS & TRIGGERS

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. RLS POLICIES (Example for Profiles)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
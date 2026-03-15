-- RJV Studio - Neon Database Schema
-- Run this in the Neon SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('recording', 'podcast', 'production', 'marketing', 'branding')),
  price_type TEXT NOT NULL CHECK (price_type IN ('hourly', 'block', 'flat')),
  price NUMERIC(10,2) NOT NULL,
  duration_hours INTEGER,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  section TEXT NOT NULL CHECK (section IN ('hero', 'gallery', 'shows', 'studios', 'team', 'about')),
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  source_url TEXT NOT NULL,
  direct_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_media_section ON media(section);
CREATE INDEX IF NOT EXISTS idx_media_active ON media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(media_type);

-- Seed services
INSERT INTO services (name, description, category, price_type, price, duration_hours) VALUES
  ('Recording Session - Hourly', 'Full access to Sound Fader Inc. Studio A. Includes engineer, booth, 32-channel mixer, and 64-key MIDI keyboard.', 'recording', 'hourly', 65.00, 1),
  ('Recording Session - 4hr Block', 'Four-hour block booking at Sound Fader Inc. Best for artists needing focused studio time.', 'recording', 'block', 250.00, 4),
  ('Recording Session - 8hr Block', 'Full workday block. Includes setup time, breaks, and full studio access.', 'recording', 'block', 480.00, 8),
  ('Recording Session - 12hr Block', 'Premium marathon session. Ideal for album tracking or intensive projects.', 'recording', 'block', 690.00, 12),
  ('Mixing and Mastering', 'Professional mix and master per session file. Delivered in WAV and MP3 formats.', 'recording', 'flat', 250.00, null),
  ('Custom Music Production', 'Original production crafted to your vision. Starts at $500, scoped per project.', 'production', 'flat', 500.00, null),
  ('Podcast Suite - Podio A', 'Sound Fader Inc. Podio A. Fully treated podcast suite with multi-mic setup and live monitoring.', 'podcast', 'hourly', 65.00, 1),
  ('Podcast Suite - Podio B', 'Sound Fader Inc. Podio B. Second podcast room with video recording capability.', 'podcast', 'hourly', 65.00, 1),
  ('Marketing Strategy Session', 'Content strategy, calendar development, and topic ideation for your brand or artist project.', 'marketing', 'hourly', 150.00, 1),
  ('Brand Identity Package', 'Logo, color system, typography, and brand guidelines. Scoped per project.', 'branding', 'flat', 800.00, null)
ON CONFLICT DO NOTHING;

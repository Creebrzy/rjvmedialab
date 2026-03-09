-- ============================================
-- RJV Studio - Full Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Profiles RLS
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SERVICES
-- ============================================
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null default '',
  category text not null check (category in ('recording', 'podcast', 'production', 'marketing', 'branding')),
  price_type text not null check (price_type in ('hourly', 'block', 'flat')),
  price numeric(10,2) not null,
  duration_hours integer,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.services enable row level security;

create policy "Anyone can view active services" on public.services
  for select using (is_active = true);

create policy "Admins can manage services" on public.services
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Seed default services
insert into public.services (name, description, category, price_type, price, duration_hours) values
  ('Recording Session – Hourly', 'Full access to Sound Fader Inc. Studio A. Includes engineer, booth, 32-channel mixer, and 64-key MIDI keyboard.', 'recording', 'hourly', 65.00, 1),
  ('Recording Session – 4hr Block', 'Four-hour block booking at Sound Fader Inc. Best for artists needing focused studio time.', 'recording', 'block', 250.00, 4),
  ('Recording Session – 8hr Block', 'Full workday block. Includes setup time, breaks, and full studio access.', 'recording', 'block', 480.00, 8),
  ('Recording Session – 12hr Block', 'Premium marathon session. Ideal for album tracking or intensive projects.', 'recording', 'block', 690.00, 12),
  ('Mixing & Mastering', 'Professional mix and master per session file. Delivered in WAV and MP3 formats.', 'recording', 'flat', 250.00, null),
  ('Custom Music Production', 'Original production crafted to your vision. Starts at $500 — scoped per project.', 'production', 'flat', 500.00, null),
  ('Podcast Suite – Podio A', 'Sound Fader Inc. Podio A. Fully treated podcast suite with multi-mic setup and live monitoring.', 'podcast', 'hourly', 65.00, 1),
  ('Podcast Suite – Podio B', 'Sound Fader Inc. Podio B. Second podcast room with video recording capability.', 'podcast', 'hourly', 65.00, 1),
  ('Marketing Strategy Session', 'Content strategy, calendar development, and topic ideation for your brand or artist project.', 'marketing', 'hourly', 150.00, 1),
  ('Brand Identity Package', 'Logo, color system, typography, and brand guidelines. Scoped per project.', 'branding', 'flat', 800.00, null);

-- ============================================
-- BOOKINGS
-- ============================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price numeric(10,2) not null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Prevent double booking same slot
  constraint no_overlap exclude using gist (
    date with =,
    service_id with =,
    tsrange(
      (date + start_time)::timestamp,
      (date + end_time)::timestamp
    ) with &&
  ) where (status not in ('cancelled'))
);

alter table public.bookings enable row level security;

create policy "Customers can view own bookings" on public.bookings
  for select using (auth.uid() = customer_id);

create policy "Customers can create bookings" on public.bookings
  for insert with check (auth.uid() = customer_id);

create policy "Customers can cancel own bookings" on public.bookings
  for update using (auth.uid() = customer_id and status = 'pending');

create policy "Admins can manage all bookings" on public.bookings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_booking_updated
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- REAL-TIME: Enable publications
-- ============================================
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.bookings, public.services;
commit;

-- ============================================
-- INDEXES for performance
-- ============================================
create index idx_bookings_date on public.bookings(date);
create index idx_bookings_customer on public.bookings(customer_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_service on public.bookings(service_id);
create index idx_services_active on public.services(is_active);

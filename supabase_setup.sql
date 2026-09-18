-- =================================================================
-- SIYANTRA BRIEF PORTAL - SUPABASE DATABASE SETUP
-- =================================================================
-- 1. Go to https://supabase.com and create a free project.
-- 2. Click "SQL Editor" in the left sidebar menu.
-- 3. Click "New query", paste ALL of this SQL code, and click "Run".
-- =================================================================

-- Create briefs table
create table public.briefs (
  id uuid default gen_random_uuid() primary key,
  ref_id text default ('SY-' || floor(random() * 900000 + 100000)::text),
  status text default 'New',
  
  -- Section 1: Client & Business Overview
  client_name text default 'N/A',
  business_name text default 'N/A',
  tagline text default 'N/A',
  industry text default 'N/A',
  email text default 'N/A',
  phone text default 'N/A',
  
  -- Section 2: Goals & Audience
  objectives text default 'N/A',
  objectives_detail text default 'N/A',
  audience text default 'N/A',
  competitor1_url text default '',
  competitor1_notes text default '',
  competitor2_url text default '',
  competitor2_notes text default '',
  competitor3_url text default '',
  competitor3_notes text default '',

  -- Section 3: Branding & Design Direction
  visual_style text default 'N/A',
  brand_logo text default 'N/A',
  brand_guidelines text default 'N/A',
  brand_colors text default 'N/A',
  brand_fonts text default 'N/A',
  inspiration1_url text default '',
  inspiration1_notes text default '',
  inspiration2_url text default '',
  inspiration2_notes text default '',
  inspiration3_url text default '',
  inspiration3_notes text default '',

  -- Section 4: Pages & Content
  pages text default 'N/A',
  custom_pages text default 'N/A',
  content_ready text default 'N/A',
  media_link text default 'N/A',

  -- Section 5: Technical Setup & Timeline
  domain_status text default 'N/A',
  domain_name text default 'N/A',
  hosting_status text default 'N/A',
  features text default 'N/A',
  target_date text default 'N/A',
  notes text default 'N/A',

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) & allow insert / read
alter table public.briefs enable row level security;

create policy "Allow anonymous insert" on public.briefs
  for insert with check (true);

create policy "Allow public read" on public.briefs
  for select using (true);

create policy "Allow public delete" on public.briefs
  for delete using (true);

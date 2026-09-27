-- ==========================================
-- MASTER DATABASE SCHEMA
-- ==========================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  tech_stack text[] default '{}',
  live_link text,
  github_link text,
  image_url text,
  is_published boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Experiences Table
create table if not exists public.experiences (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text not null,
  start_date date not null,
  end_date date, -- null means "Present"
  description text,
  company_logo_url text, -- optional company logo URL
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If experiences table already exists, ensure company_logo_url column is added:
alter table public.experiences add column if not exists company_logo_url text;

-- 3. Create Education Table
create table if not exists public.education (
  id uuid default gen_random_uuid() primary key,
  stage text not null, -- e.g. 'Graduation', 'High Schooling', 'Junior Schooling'
  degree text not null, -- e.g. 'B.E in Computer Science Engineering (Data Science)'
  institution text not null, -- e.g. 'A.P. Shah Institute Of Technology, Thane'
  board text, -- e.g. 'University of Mumbai'
  period text not null, -- e.g. '2023 — 2027'
  description text, -- coursework, achievements, CGPA, etc.
  institution_logo_url text, -- optional institute logo URL
  board_logo_url text, -- optional board/university logo URL
  sort_order integer default 0,
  is_current boolean default false,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If education table already exists, ensure description and logo columns are added:
alter table public.education add column if not exists description text;
alter table public.education add column if not exists institution_logo_url text;
alter table public.education add column if not exists board_logo_url text;

-- 4. Create Resumes Table
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  version_name text not null,
  file_url text not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Testimonials Table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  author_name text not null,
  author_role text,
  content text not null,
  social_links text[] default '{}', -- array of URLs (Twitter, LinkedIn, GitHub, etc.)
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If testimonials table already exists, ensure social_links column is added:
alter table public.testimonials add column if not exists social_links text[] default '{}';

-- 6. Create Skills (Stack) Table
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- e.g., 'Frontend', 'Backend', 'Tools'
  icon_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.resumes enable row level security;
alter table public.testimonials enable row level security;
alter table public.skills enable row level security;

-- 8. Public Read Policies
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects" on public.projects for select using (is_published = true);

drop policy if exists "Public can view published experiences" on public.experiences;
create policy "Public can view published experiences" on public.experiences for select using (is_published = true);

drop policy if exists "Public can view published education" on public.education;
create policy "Public can view published education" on public.education for select using (is_published = true);

drop policy if exists "Public can view active resumes" on public.resumes;
create policy "Public can view active resumes" on public.resumes for select using (is_active = true);

drop policy if exists "Public can view published testimonials" on public.testimonials;
create policy "Public can view published testimonials" on public.testimonials for select using (is_published = true);

drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills" on public.skills for select using (true);

-- 9. Admin Write Policies (Authenticated users can do everything)
drop policy if exists "Admins can do everything on projects" on public.projects;
create policy "Admins can do everything on projects" on public.projects for all to authenticated using (true);

drop policy if exists "Admins can do everything on experiences" on public.experiences;
create policy "Admins can do everything on experiences" on public.experiences for all to authenticated using (true);

drop policy if exists "Admins can do everything on education" on public.education;
create policy "Admins can do everything on education" on public.education for all to authenticated using (true);

drop policy if exists "Admins can do everything on resumes" on public.resumes;
create policy "Admins can do everything on resumes" on public.resumes for all to authenticated using (true);

drop policy if exists "Admins can do everything on testimonials" on public.testimonials;
create policy "Admins can do everything on testimonials" on public.testimonials for all to authenticated using (true);

drop policy if exists "Admins can do everything on skills" on public.skills;
create policy "Admins can do everything on skills" on public.skills for all to authenticated using (true);

-- 10. Seed Initial Education Milestones
insert into public.education (stage, degree, institution, board, period, sort_order, is_current, is_published)
values
  ('Graduation', 'B.E in Computer Science Engineering (Data Science)', 'A.P. Shah Institute Of Technology, Thane', 'University of Mumbai', '2023 — 2027', 1, true, true),
  ('High Schooling', 'Higher Secondary Education (Class XI — XII)', 'Euro School, Thane', 'Council for the Indian School Certificate Examinations', '2021 — 2023', 2, false, true),
  ('Junior Schooling', 'Primary & Secondary Schooling (Class I — X)', 'Lok Puram Public School, Thane', 'Central Board of Secondary Education', '2009 — 2021', 3, false, true)
on conflict do nothing;

-- 11. Storage Bucket & Policies for Uploads (Resumes, Logos, Screenshots)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets" on storage.objects 
  for select using (bucket_id = 'portfolio-assets');

drop policy if exists "Admins can upload portfolio assets" on storage.objects;
create policy "Admins can upload portfolio assets" on storage.objects 
  for insert to authenticated with check (bucket_id = 'portfolio-assets');

drop policy if exists "Admins can update portfolio assets" on storage.objects;
create policy "Admins can update portfolio assets" on storage.objects 
  for update to authenticated using (bucket_id = 'portfolio-assets');

drop policy if exists "Admins can delete portfolio assets" on storage.objects;
create policy "Admins can delete portfolio assets" on storage.objects 
  for delete to authenticated using (bucket_id = 'portfolio-assets');

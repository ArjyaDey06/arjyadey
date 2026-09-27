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
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Resumes Table
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  version_name text not null,
  file_url text not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Testimonials Table
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

-- 5. Create Skills (Stack) Table
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- e.g., 'Frontend', 'Backend', 'Tools'
  icon_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.resumes enable row level security;
alter table public.testimonials enable row level security;
alter table public.skills enable row level security;

-- 7. Public Read Policies
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects" on public.projects for select using (is_published = true);

drop policy if exists "Public can view published experiences" on public.experiences;
create policy "Public can view published experiences" on public.experiences for select using (is_published = true);

drop policy if exists "Public can view active resumes" on public.resumes;
create policy "Public can view active resumes" on public.resumes for select using (is_active = true);

drop policy if exists "Public can view published testimonials" on public.testimonials;
create policy "Public can view published testimonials" on public.testimonials for select using (is_published = true);

drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills" on public.skills for select using (true);

-- 8. Admin Write Policies (Authenticated users can do everything)
drop policy if exists "Admins can do everything on projects" on public.projects;
create policy "Admins can do everything on projects" on public.projects for all to authenticated using (true);

drop policy if exists "Admins can do everything on experiences" on public.experiences;
create policy "Admins can do everything on experiences" on public.experiences for all to authenticated using (true);

drop policy if exists "Admins can do everything on resumes" on public.resumes;
create policy "Admins can do everything on resumes" on public.resumes for all to authenticated using (true);

drop policy if exists "Admins can do everything on testimonials" on public.testimonials;
create policy "Admins can do everything on testimonials" on public.testimonials for all to authenticated using (true);

drop policy if exists "Admins can do everything on skills" on public.skills;
create policy "Admins can do everything on skills" on public.skills for all to authenticated using (true);

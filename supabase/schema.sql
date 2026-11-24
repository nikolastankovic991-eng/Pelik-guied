-- PELIK GUIDE: secure directory foundation
-- Run this in the Supabase SQL Editor after creating a Supabase project.
-- No passwords, service-role keys, or private credentials belong in this file.

create extension if not exists pgcrypto;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin'))
);

create or replace function public.is_pelik_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_pelik_admin() from public;
grant execute on function public.is_pelik_admin() to authenticated;

create table if not exists public.business_listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  categories text[] not null default '{}',
  locality text not null,
  address text,
  phone text,
  email text,
  website text,
  map_url text,
  description text,
  image_url text,
  image_permission_status text not null default 'not-confirmed'
    check (image_permission_status in ('not-confirmed','permission-granted','licensed','not-required')),
  listing_status text not null default 'pending'
    check (listing_status in ('pending','approved','rejected','suspended')),
  is_published boolean not null default false,
  plan text not null default 'free'
    check (plan in ('free','featured','premium')),
  is_sponsored boolean not null default false,
  submitted_by uuid references auth.users(id) on delete set null,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint published_only_when_approved
    check (is_published = false or listing_status = 'approved'),
  constraint sponsored_only_for_paid_plans
    check (is_sponsored = false or plan in ('featured','premium'))
);

create index if not exists business_listings_public_idx
  on public.business_listings (locality, listing_status, is_published);
create index if not exists business_listings_plan_idx
  on public.business_listings (plan);

alter table public.user_roles enable row level security;
alter table public.business_listings enable row level security;

drop policy if exists "Admins can view roles" on public.user_roles;
create policy "Admins can view roles"
  on public.user_roles for select
  to authenticated
  using (public.is_pelik_admin());

drop policy if exists "Public can view published approved listings" on public.business_listings;
create policy "Public can view published approved listings"
  on public.business_listings for select
  to anon, authenticated
  using (listing_status = 'approved' and is_published = true);

drop policy if exists "Admins can manage all listings" on public.business_listings;
create policy "Admins can manage all listings"
  on public.business_listings for all
  to authenticated
  using (public.is_pelik_admin())
  with check (public.is_pelik_admin());

drop policy if exists "Users can submit pending listings" on public.business_listings;
create policy "Users can submit pending listings"
  on public.business_listings for insert
  to authenticated
  with check (
    submitted_by = (select auth.uid())
    and listing_status = 'pending'
    and is_published = false
    and plan = 'free'
    and is_sponsored = false
    and admin_notes is null
    and approved_at is null
  );

-- Deliberately no public update/delete policy:
-- applicants cannot approve, publish, feature, or edit records after submission.
-- Only a trusted admin can do those operations.

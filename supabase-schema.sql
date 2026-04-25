-- ═══════════════════════════════════════════════════════════════════
-- AttorneyAITools.org — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── TABLES ─────────────────────────────────────────────────────────────────

-- profiles: one row per user, extends auth.users
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  business_name   text,
  business_type   text,
  plan            text not null default 'free'
                  check (plan in ('free','basic','premium','enterprise')),
  onboarding_done boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- policies: uploaded insurance documents
create table public.policies (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  policy_number   text,
  insurer_name    text,
  policy_type     text default 'Commercial Property',
  premium_cents   integer,
  effective_date  date,
  expiry_date     date,
  storage_path    text,
  file_name       text,
  file_size_bytes integer,
  page_count      integer,
  coverage_score  integer,
  analysis_status text not null default 'pending'
                  check (analysis_status in ('pending','processing','done','error')),
  analysis_json   jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- coverage_items: sections extracted from a policy
create table public.coverage_items (
  id            uuid primary key default uuid_generate_v4(),
  policy_id     uuid not null references public.policies(id) on delete cascade,
  label         text not null,
  limit_cents   integer,
  covered       boolean not null default true,
  flag_text     text,
  sort_order    integer not null default 0
);

-- policy_risks: flagged issues per policy
create table public.policy_risks (
  id          uuid primary key default uuid_generate_v4(),
  policy_id   uuid not null references public.policies(id) on delete cascade,
  level       text not null check (level in ('high','med','low')),
  title       text not null,
  detail      text
);

-- claims: filed insurance claims
create table public.claims (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  policy_id            uuid references public.policies(id) on delete set null,
  claim_ref            text,
  incident_type        text,
  incident_date        date,
  status               text not null default 'open'
                       check (status in ('open','negotiating','settled','denied','closed')),
  insurer_offer_cents  integer,
  fair_low_cents       integer,
  fair_high_cents      integer,
  -- days_open computed in queries as: current_date - incident_date
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- documents: all files in the vault
create table public.documents (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  claim_id            uuid references public.claims(id) on delete set null,
  policy_id           uuid references public.policies(id) on delete set null,
  storage_path        text not null,
  file_name           text not null,
  file_size_bytes     integer,
  mime_type           text,
  kind                text,  -- Policy, Evidence, Photos, Inventory, Estimate, Correspondence
  verification_status text not null default 'pending'
                      check (verification_status in ('pending','verified')),
  created_at          timestamptz not null default now()
);

-- deadlines: important dates for claims
create table public.deadlines (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  claim_id    uuid references public.claims(id) on delete cascade,
  due_date    date not null,
  title       text not null,
  kind        text,
  status      text not null default 'upcoming'
              check (status in ('upcoming','done','missed'))
);

-- notification preferences
create table public.notification_prefs (
  user_id              uuid primary key references public.profiles(id) on delete cascade,
  deadline_reminders   boolean not null default true,
  claim_updates        boolean not null default true,
  ai_draft_ready       boolean not null default true,
  policy_renewal       boolean not null default false,
  weekly_digest        boolean not null default false
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_policies_updated_at
  before update on public.policies
  for each row execute function public.set_updated_at();

create trigger trg_claims_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────────────────────
-- Fires automatically after auth.signUp() — no frontend insert needed
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, business_name, business_type, plan)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'business_type',
    coalesce(new.raw_user_meta_data->>'plan', 'free')
  );

  insert into public.notification_prefs (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
alter table public.profiles           enable row level security;
alter table public.policies           enable row level security;
alter table public.coverage_items     enable row level security;
alter table public.policy_risks       enable row level security;
alter table public.claims             enable row level security;
alter table public.documents          enable row level security;
alter table public.deadlines          enable row level security;
alter table public.notification_prefs enable row level security;

-- Users see only their own data
create policy "profiles: own"      on public.profiles      for all using (auth.uid() = id);
create policy "policies: own"      on public.policies      for all using (auth.uid() = user_id);
create policy "claims: own"        on public.claims        for all using (auth.uid() = user_id);
create policy "documents: own"     on public.documents     for all using (auth.uid() = user_id);
create policy "deadlines: own"     on public.deadlines     for all using (auth.uid() = user_id);
create policy "notif_prefs: own"   on public.notification_prefs for all using (auth.uid() = user_id);

create policy "coverage_items: via policy" on public.coverage_items for all using (
  exists (select 1 from public.policies p where p.id = policy_id and p.user_id = auth.uid())
);
create policy "policy_risks: via policy"   on public.policy_risks   for all using (
  exists (select 1 from public.policies p where p.id = policy_id and p.user_id = auth.uid())
);

-- ─── STORAGE BUCKET ─────────────────────────────────────────────────────────
-- Run these OR create the bucket in Dashboard → Storage → Create bucket (name: policy-docs, Private)
insert into storage.buckets (id, name, public) values ('policy-docs', 'policy-docs', false)
on conflict do nothing;

-- Users can only access files inside their own {user_id}/ folder
create policy "storage: owner upload" on storage.objects
  for insert with check (
    bucket_id = 'policy-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owner read" on storage.objects
  for select using (
    bucket_id = 'policy-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owner delete" on storage.objects
  for delete using (
    bucket_id = 'policy-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ═══════════════════════════════════════════════════════════════════
-- DONE. Verify by running:
-- select tablename from pg_tables where schemaname = 'public';
-- You should see: profiles, policies, coverage_items, policy_risks,
-- claims, documents, deadlines, notification_prefs
-- ═══════════════════════════════════════════════════════════════════

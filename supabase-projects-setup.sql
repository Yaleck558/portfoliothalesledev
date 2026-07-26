-- ============================================================
-- MIGRATION: Table projects complète (statut, mise en avant,
-- ordre manuel, technologies, image) + Storage + RLS
-- À exécuter dans Supabase > SQL Editor > New Query > Run
-- Sans danger si la table `projects` existe déjà (ADD COLUMN IF NOT EXISTS)
-- ============================================================

-- 1) Table projects (créée si elle n'existe pas encore)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2) Colonnes manquantes ajoutées en toute sécurité
alter table public.projects add column if not exists image_url text;
alter table public.projects add column if not exists technologies text[] not null default '{}';
alter table public.projects add column if not exists category text;
alter table public.projects add column if not exists demo_url text;
alter table public.projects add column if not exists github_url text;
alter table public.projects add column if not exists status text not null default 'draft';
alter table public.projects add column if not exists is_featured boolean not null default false;
alter table public.projects add column if not exists display_order integer not null default 0;

-- Contrainte : status ne peut être que 'draft' ou 'published'
alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects add constraint projects_status_check
  check (status in ('draft', 'published'));

-- Index utiles
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_status_order_idx on public.projects (status, display_order);

-- 3) Trigger updated_at (réutilise la fonction si elle existe déjà,
-- sinon la crée -- même fonction que pour portfolio_data)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at_column();

-- 4) Row Level Security
alter table public.projects enable row level security;

-- Lecture publique : uniquement les projets publiés
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects for select
  using (status = 'published');

-- Le propriétaire voit TOUS ses projets (brouillons inclus)
drop policy if exists "Owner can view own projects" on public.projects;
create policy "Owner can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

-- Le propriétaire peut créer ses projets
drop policy if exists "Owner can insert own projects" on public.projects;
create policy "Owner can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

-- Le propriétaire peut modifier ses projets
drop policy if exists "Owner can update own projects" on public.projects;
create policy "Owner can update own projects"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Le propriétaire peut supprimer ses projets
drop policy if exists "Owner can delete own projects" on public.projects;
create policy "Owner can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 5) Storage bucket pour les images de projets
-- ============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Lecture publique des images (le bucket est public, mais on
-- explicite quand même la policy pour le schema storage.objects)
drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Seuls les utilisateurs connectés peuvent uploader dans ce bucket
drop policy if exists "Authenticated users can upload project images" on storage.objects;
create policy "Authenticated users can upload project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- Chacun peut mettre à jour/supprimer uniquement ses propres fichiers
-- (on stocke les fichiers sous un dossier nommé par user_id, ex: <user_id>/monimage.png)
drop policy if exists "Users can update own project images" on storage.objects;
create policy "Users can update own project images"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete own project images" on storage.objects;
create policy "Users can delete own project images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.uid()::text = (storage.foldername(name))[1]);

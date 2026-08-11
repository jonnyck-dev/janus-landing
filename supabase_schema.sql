-- JANUS Landing — Supabase schema
-- Ejecuta en: Supabase → SQL Editor → Run
-- Basado en el schema estándar de Supabase (perfies públicos) + ajustes para JANUS.

-- 1. Crear una tabla para perfiles públicos de usuarios
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  provider text,

  constraint username_length check (char_length(username) >= 3)
);

-- 2. Habilitar el control de seguridad de fila (Row Level Security)
alter table public.profiles enable row level security;

-- 3. Crear políticas de acceso (RLS)
drop policy if exists "Los perfiles públicos son visibles para todos." on public.profiles;
create policy "Los perfiles públicos son visibles para todos." on public.profiles
  for select using (true);

drop policy if exists "Los usuarios pueden insertar su propio perfil." on public.profiles;
create policy "Los usuarios pueden insertar su propio perfil." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Los usuarios pueden actualizar su propio perfil." on public.profiles;
create policy "Los usuarios pueden actualizar su propio perfil." on public.profiles
  for update using (auth.uid() = id);

-- 4. Función que inserta automáticamente el perfil cuando se registra un usuario en auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, provider)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 5. Trigger que ejecuta la función anterior después de un registro exitoso
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Tabla para leads de la calculadora de ROI
create table if not exists public.roi_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  channel_language text not null,
  monthly_views numeric not null,
  cpm numeric not null,
  estimated_loss numeric not null,
  created_at timestamptz default now()
);

-- 7. Habilitar RLS para roi_leads
alter table public.roi_leads enable row level security;

-- 8. Políticas de acceso para roi_leads
drop policy if exists "Users can insert own leads" on public.roi_leads;
create policy "Users can insert own leads"
  on public.roi_leads for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own leads" on public.roi_leads;
create policy "Users can view own leads"
  on public.roi_leads for select
  using (auth.uid() = user_id);

-- 9. Tabla de créditos digitales (comprados vía Lemon Squeezy)
-- Un crédito = 1 video procesable según el plan. Vigencia: 1 mes desde la compra.
create table if not exists public.user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text not null check (plan in ('essential', 'multivoice', 'global')),
  status text not null default 'available' check (status in ('available', 'used', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '1 month',
  used_at timestamptz
);

-- 10. Habilitar RLS para user_credits
alter table public.user_credits enable row level security;

-- 11. El usuario solo puede ver SUS créditos activos (SELECT own)
drop policy if exists "Users can view own credits" on public.user_credits;
create policy "Users can view own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

-- Nota: los créditos se insertan desde el backend (webhook de Lemon Squeezy)
-- con la service_role key, que omite RLS. No se habilita INSERT directo por el usuario.

-- 12. Tabla de trabajos de doblaje (JANUS Studio)
-- Un cliente pega la URL de su video → se crea un job en cola → el admin procesa
-- manualmente y marca el estado. Entrega máxima: 1 día.
create table if not exists public.dub_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  email text,
  video_url text not null,
  target_lang text not null default 'es',
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'done', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  delivered_at timestamptz,
  admin_note text
);

-- Si la tabla ya existía (de un run anterior), asegura la columna email
alter table public.dub_jobs add column if not exists email text;

-- 13. Habilitar RLS para dub_jobs
alter table public.dub_jobs enable row level security;

-- 14. El cliente puede crear y ver SUS trabajos
drop policy if exists "Users can insert own dub jobs" on public.dub_jobs;
create policy "Users can insert own dub jobs"
  on public.dub_jobs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own dub jobs" on public.dub_jobs;
create policy "Users can view own dub jobs"
  on public.dub_jobs for select
  using (auth.uid() = user_id);

-- 15. El administrador ve y actualiza TODOS los trabajos
drop policy if exists "Admin can view all dub jobs" on public.dub_jobs;
create policy "Admin can view all dub jobs"
  on public.dub_jobs for select
  using (auth.email() = 'admin@janusdubber.website');

drop policy if exists "Admin can update all dub jobs" on public.dub_jobs;
create policy "Admin can update all dub jobs"
  on public.dub_jobs for update
  using (auth.email() = 'admin@janusdubber.website');

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
  email text,
  provider text,

  constraint username_length check (char_length(username) >= 3)
);

-- 2. Habilitar el control de seguridad de fila (Row Level Security)
alter table public.profiles enable row level security;

-- 3. Crear políticas de acceso (RLS)
create policy "Los perfiles públicos son visibles para todos." on public.profiles
  for select using (true);

create policy "Los usuarios pueden insertar su propio perfil." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil." on public.profiles
  for update using (auth.uid() = id);

-- 4. Función que inserta automáticamente el perfil cuando se registra un usuario en auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, provider)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email,
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

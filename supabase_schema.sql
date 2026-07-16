-- JANUS Landing — Supabase schema
-- Ejecuta en: Supabase → SQL Editor → Run

-- 1) Tabla de perfiles (espejo de auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    provider text,
    created_at timestamptz default now()
);

-- 2) Trigger: al registrarse en auth.users, crear perfil
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, provider)
    values (
        new.id,
        new.email,
        coalesce(new.raw_app_meta_data->>'provider', 'email')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- 3) Row Level Security: cada usuario solo ve su propio perfil
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

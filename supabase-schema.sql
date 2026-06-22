create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.categories(id) on delete restrict,
  name text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  low_stock_daily_email_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  group_id uuid references public.item_groups(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  quantity integer not null default 0,
  min_quantity integer not null default 0,
  low_stock_enabled boolean not null default false,
  image_url text,
  barcode text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint items_quantity_check check (quantity >= 0),
  constraint items_min_quantity_check check (min_quantity >= 0)
);

create table if not exists public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  item_name text not null,
  type text not null check (type in ('create', 'update', 'delete')),
  changed_fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists categories_parent_id_idx on public.categories(parent_id);
create index if not exists locations_user_id_idx on public.locations(user_id);
create index if not exists item_groups_user_id_idx on public.item_groups(user_id);
create index if not exists user_settings_low_stock_daily_email_enabled_idx on public.user_settings(low_stock_daily_email_enabled);
create index if not exists items_user_id_idx on public.items(user_id);
create index if not exists items_category_id_idx on public.items(category_id);
create index if not exists items_group_id_idx on public.items(group_id);
create index if not exists items_location_id_idx on public.items(location_id);
create index if not exists items_barcode_idx on public.items(barcode);
create index if not exists items_low_stock_idx on public.items(user_id, low_stock_enabled, quantity, min_quantity);
create index if not exists inventory_logs_user_id_idx on public.inventory_logs(user_id);
create index if not exists inventory_logs_item_id_idx on public.inventory_logs(item_id);
create index if not exists inventory_logs_created_at_idx on public.inventory_logs(created_at);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_locations_updated_at on public.locations;
create trigger set_locations_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists set_item_groups_updated_at on public.item_groups;
create trigger set_item_groups_updated_at
before update on public.item_groups
for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.item_groups enable row level security;
alter table public.user_settings enable row level security;
alter table public.items enable row level security;
alter table public.inventory_logs enable row level security;

drop policy if exists "Users can read own categories" on public.categories;
create policy "Users can read own categories"
on public.categories
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own categories" on public.categories;
create policy "Users can insert own categories"
on public.categories
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own categories" on public.categories;
create policy "Users can update own categories"
on public.categories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own categories" on public.categories;
create policy "Users can delete own categories"
on public.categories
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own locations" on public.locations;
create policy "Users can read own locations"
on public.locations
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own locations" on public.locations;
create policy "Users can insert own locations"
on public.locations
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own locations" on public.locations;
create policy "Users can update own locations"
on public.locations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own locations" on public.locations;
create policy "Users can delete own locations"
on public.locations
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own item groups" on public.item_groups;
create policy "Users can read own item groups"
on public.item_groups
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own item groups" on public.item_groups;
create policy "Users can insert own item groups"
on public.item_groups
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own item groups" on public.item_groups;
create policy "Users can update own item groups"
on public.item_groups
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own item groups" on public.item_groups;
create policy "Users can delete own item groups"
on public.item_groups
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own settings" on public.user_settings;
create policy "Users can read own settings"
on public.user_settings
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings"
on public.user_settings
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings"
on public.user_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own items" on public.items;
create policy "Users can read own items"
on public.items
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own items" on public.items;
create policy "Users can insert own items"
on public.items
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own items" on public.items;
create policy "Users can update own items"
on public.items
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own items" on public.items;
create policy "Users can delete own items"
on public.items
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own inventory logs" on public.inventory_logs;
create policy "Users can read own inventory logs"
on public.inventory_logs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own inventory logs" on public.inventory_logs;
create policy "Users can insert own inventory logs"
on public.inventory_logs
for insert
to authenticated
with check (auth.uid() = user_id);

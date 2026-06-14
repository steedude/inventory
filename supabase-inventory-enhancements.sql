alter table public.items
add column if not exists min_quantity integer not null default 0;

alter table public.items
add column if not exists low_stock_enabled boolean not null default false;

alter table public.items
drop constraint if exists items_min_quantity_check;

alter table public.items
add constraint items_min_quantity_check check (min_quantity >= 0);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  item_name text not null,
  type text not null,
  quantity_before integer,
  quantity_after integer,
  quantity_delta integer,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists items_low_stock_idx on public.items(user_id, low_stock_enabled, quantity, min_quantity);
create index if not exists inventory_movements_user_id_idx on public.inventory_movements(user_id);
create index if not exists inventory_movements_item_id_idx on public.inventory_movements(item_id);
create index if not exists inventory_movements_created_at_idx on public.inventory_movements(created_at);

alter table public.inventory_movements enable row level security;

drop policy if exists "Users can read own inventory movements" on public.inventory_movements;
create policy "Users can read own inventory movements"
on public.inventory_movements
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own inventory movements" on public.inventory_movements;
create policy "Users can insert own inventory movements"
on public.inventory_movements
for insert
to authenticated
with check (auth.uid() = user_id);

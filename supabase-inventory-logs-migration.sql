do $$
begin
  if to_regclass('public.inventory_logs') is null
     and to_regclass('public.inventory_movements') is not null then
    alter table public.inventory_movements rename to inventory_logs;
  end if;
end $$;

alter index if exists inventory_movements_user_id_idx rename to inventory_logs_user_id_idx;
alter index if exists inventory_movements_item_id_idx rename to inventory_logs_item_id_idx;
alter index if exists inventory_movements_created_at_idx rename to inventory_logs_created_at_idx;

alter table public.inventory_logs
add column if not exists changed_fields jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'inventory_logs'
      and column_name = 'quantity_before'
  ) then
    update public.inventory_logs
    set changed_fields = jsonb_build_array(jsonb_build_object(
      'field', 'quantity',
      'before', quantity_before,
      'after', quantity_after
    ))
    where changed_fields = '[]'::jsonb
      and (
        quantity_before is not null
        or quantity_after is not null
        or quantity_delta is not null
      );
  end if;
end $$;

alter table public.inventory_logs
drop column if exists quantity_before,
drop column if exists quantity_after,
drop column if exists quantity_delta,
drop column if exists note;

alter table public.inventory_logs
drop constraint if exists inventory_movements_type_check,
drop constraint if exists inventory_logs_type_check;

alter table public.inventory_logs
add constraint inventory_logs_type_check check (type in ('create', 'update', 'delete'));

drop policy if exists "Users can read own inventory movements" on public.inventory_logs;
drop policy if exists "Users can insert own inventory movements" on public.inventory_logs;
drop policy if exists "Users can read own inventory logs" on public.inventory_logs;
drop policy if exists "Users can insert own inventory logs" on public.inventory_logs;

alter table public.inventory_logs enable row level security;

create policy "Users can read own inventory logs"
on public.inventory_logs
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own inventory logs"
on public.inventory_logs
for insert
to authenticated
with check (auth.uid() = user_id);

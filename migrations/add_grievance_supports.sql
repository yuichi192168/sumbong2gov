-- Create a table for grievance supports/likes
create table
  public.grievance_supports (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    grievance_id uuid not null,
    supporter_ip text not null,
    constraint grievance_supports_pkey primary key (id),
    constraint grievance_supports_grievance_id_fkey foreign key (grievance_id) references grievances (id) on delete cascade,
    constraint grievance_supports_unique unique (grievance_id, supporter_ip)
  ) tablespace pg_default;

-- Enable Row Level Security
alter table public.grievance_supports enable row level security;

-- Create policies for public access
create policy "Public supports are viewable by everyone." on public.grievance_supports for
select
  using (true);

create policy "Allow anonymous support submission" on public.grievance_supports for
insert
  with check (true);

-- Add support_count to grievances view for easy querying
create or replace view grievance_with_support_count as
select 
    g.*,
    coalesce(s.support_count, 0) as support_count
from 
    grievances g
left join (
    select grievance_id, count(*) as support_count
    from grievance_supports
    group by grievance_id
) s on g.id = s.grievance_id;
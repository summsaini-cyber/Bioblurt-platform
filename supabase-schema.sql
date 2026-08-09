-- Enable RLS on all tables
-- Run this in Supabase SQL Editor

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Blurt attempts
create table if not exists blurts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic text not null,
  subtopic text not null,
  score numeric not null,
  blurt_text text not null,
  matched_points text[] default '{}',
  manual_rag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table blurts enable row level security;

create policy "Users can view own blurts"
  on blurts for select
  using (auth.uid() = user_id);

create policy "Users can insert own blurts"
  on blurts for insert
  with check (auth.uid() = user_id);

-- Tracker points (spec coverage)
create table if not exists tracker_points (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic text not null,
  subtopic text not null,
  point_text text not null,
  point_key text not null,
  rag text not null default 'Red',
  notes text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, point_key)
);

alter table tracker_points enable row level security;

create policy "Users can view own tracker points"
  on tracker_points for select
  using (auth.uid() = user_id);

create policy "Users can upsert own tracker points"
  on tracker_points for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tracker points"
  on tracker_points for update
  using (auth.uid() = user_id);

create policy "Users can delete own tracker points"
  on tracker_points for delete
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

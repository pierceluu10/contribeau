-- users table (stores spotify tokens)
create table users (
  id uuid primary key default gen_random_uuid(),
  spotify_id text unique not null,
  display_name text,
  avatar_url text,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  last_polled_cursor bigint,
  created_at timestamptz default now()
);

-- listening history (one row per track play)
create table listening_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  track_id text not null,
  track_name text not null,
  artist_name text not null,
  album_name text,
  album_image_url text,
  duration_ms integer not null,
  played_at timestamptz not null,
  unique(user_id, played_at)
);

-- index for heatmap queries
create index idx_history_user_date on listening_history(user_id, played_at);

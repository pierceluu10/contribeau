import { supabase } from "./supabase";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export function getSpotifyAuthUrl() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: "user-read-recently-played user-top-read user-read-currently-playing",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    show_dialog: "true",
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Token exchange error:", res.status, body);
    throw new Error(`Failed to exchange code for tokens: ${res.status}`);
  }
  return res.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

export async function getValidToken(user: {
  id: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
}) {
  const expiresAt = new Date(user.token_expires_at).getTime();
  if (Date.now() < expiresAt - 60_000) {
    return user.access_token;
  }

  const data = await refreshAccessToken(user.refresh_token);
  const newExpiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();

  await supabase
    .from("users")
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? user.refresh_token,
      token_expires_at: newExpiresAt,
    })
    .eq("id", user.id);

  return data.access_token as string;
}

export async function spotifyFetch(accessToken: string, endpoint: string) {
  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json();
}

export async function getSpotifyProfile(accessToken: string) {
  return spotifyFetch(accessToken, "/me");
}

export async function getRecentlyPlayed(
  accessToken: string,
  after?: number | null
) {
  const params = new URLSearchParams({ limit: "50" });
  if (after) params.set("after", String(after));
  return spotifyFetch(accessToken, `/me/player/recently-played?${params}`);
}

export async function getCurrentlyPlaying(accessToken: string) {
  const res = await fetch(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 204) return null; // nothing playing
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  return res.json();
}

export async function getTopItems(
  accessToken: string,
  type: "artists" | "tracks",
  timeRange: "short_term" | "medium_term" | "long_term" = "short_term",
  limit = 10
) {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: String(limit),
  });
  return spotifyFetch(accessToken, `/me/top/${type}?${params}`);
}

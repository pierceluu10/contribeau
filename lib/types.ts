export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  totalMs: number;
  trackCount: number;
  topArtist: string | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}
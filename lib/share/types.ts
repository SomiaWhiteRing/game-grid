export type GameTypeId = 0 | 1 | 2 | 3 | 4 | 8 | 9 | 10 | 11;

export interface ShareGame {
  id: number | string;
  name: string;
  localizedName?: string;
  cover: string | null;
  releaseYear?: number;
  gameTypeId?: GameTypeId;
  platforms?: string[];
  genres?: string[];
  storeUrls?: Record<string, string>;
  comment?: string;
  spoiler?: boolean;
}

export interface GameSearchResponse {
  ok: boolean;
  source: "bangumi";
  items: ShareGame[];
  topPickIds: Array<string | number>;
  suggestions: string[];
  noResultQuery: string | null;
}

export interface StoredShareV1 {
  shareId: string;
  creatorName: string | null;
  games: Array<ShareGame | null>;
  createdAt: number;
  updatedAt: number;
  lastViewedAt: number;
}

export type TrendPeriod = "30d" | "90d" | "180d" | "all";
export type TrendView = "overall" | "genre" | "decade" | "year";

export interface TrendGameItem {
  id: string;
  name: string;
  localizedName?: string;
  cover: string | null;
  releaseYear?: number;
  count: number;
}

export interface TrendBucket {
  key: string;
  label: string;
  count: number;
  games: TrendGameItem[];
}

export interface TrendResponse {
  period: TrendPeriod;
  view: TrendView;
  sampleCount: number;
  range: {
    from: number | null;
    to: number | null;
  };
  lastUpdatedAt: number;
  items: TrendBucket[];
}

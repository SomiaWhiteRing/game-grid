import { kv } from "@vercel/kv";
import { StoredShareV1, TrendPeriod, TrendResponse, TrendView } from "@/lib/share/types";

const SHARE_KEY_PREFIX = "share:";
const SHARE_IDS_KEY = "share:index:ids";
const SHARE_INDEX_CREATED_KEY = "share:index:created";
const SHARE_INDEX_UPDATED_KEY = "share:index:updated";
const TRENDS_CACHE_PREFIX = "trends:cache:";

const KV_ENABLED = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

type MemoryStore = {
  shares: Map<string, StoredShareV1>;
  trendCache: Map<string, { value: TrendResponse; expiresAt: number }>;
};

function getMemoryStore(): MemoryStore {
  const g = globalThis as typeof globalThis & {
    __GAMEGRID_SHARE_MEMORY__?: MemoryStore;
  };

  if (!g.__GAMEGRID_SHARE_MEMORY__) {
    g.__GAMEGRID_SHARE_MEMORY__ = {
      shares: new Map<string, StoredShareV1>(),
      trendCache: new Map<string, { value: TrendResponse; expiresAt: number }>(),
    };
  }
  return g.__GAMEGRID_SHARE_MEMORY__;
}

function trendCacheKey(period: TrendPeriod, view: TrendView) {
  return `${TRENDS_CACHE_PREFIX}${period}:${view}`;
}

async function safeKvGet<T>(key: string): Promise<T | null> {
  try {
    return (await kv.get<T>(key)) ?? null;
  } catch {
    return null;
  }
}

export async function saveShare(record: StoredShareV1): Promise<void> {
  if (!KV_ENABLED) {
    getMemoryStore().shares.set(record.shareId, record);
    return;
  }

  const key = `${SHARE_KEY_PREFIX}${record.shareId}`;
  try {
    await kv.set(key, record);
    await kv.sadd(SHARE_IDS_KEY, record.shareId);
    await kv.zadd(SHARE_INDEX_CREATED_KEY, {
      score: record.createdAt,
      member: record.shareId,
    });
    await kv.zadd(SHARE_INDEX_UPDATED_KEY, {
      score: record.updatedAt,
      member: record.shareId,
    });
  } catch {
    getMemoryStore().shares.set(record.shareId, record);
  }
}

export async function getShare(shareId: string): Promise<StoredShareV1 | null> {
  if (!KV_ENABLED) {
    return getMemoryStore().shares.get(shareId) ?? null;
  }

  const key = `${SHARE_KEY_PREFIX}${shareId}`;
  const fromKv = await safeKvGet<StoredShareV1>(key);
  if (fromKv) {
    return fromKv;
  }
  return getMemoryStore().shares.get(shareId) ?? null;
}

export async function touchShare(shareId: string, now = Date.now()): Promise<boolean> {
  const existing = await getShare(shareId);
  if (!existing) {
    return false;
  }

  const updated: StoredShareV1 = {
    ...existing,
    updatedAt: now,
    lastViewedAt: now,
  };
  await saveShare(updated);
  return true;
}

async function getAllShareIdsFromKv(): Promise<string[]> {
  try {
    const ids = await kv.smembers<string[]>(SHARE_IDS_KEY);
    if (Array.isArray(ids)) {
      return ids.map((id) => String(id));
    }
    return [];
  } catch {
    return [];
  }
}

export async function listAllShares(): Promise<StoredShareV1[]> {
  if (!KV_ENABLED) {
    return Array.from(getMemoryStore().shares.values());
  }

  const ids = await getAllShareIdsFromKv();
  if (ids.length === 0) {
    return Array.from(getMemoryStore().shares.values());
  }

  const results: StoredShareV1[] = [];
  for (const shareId of ids) {
    const record = await safeKvGet<StoredShareV1>(`${SHARE_KEY_PREFIX}${shareId}`);
    if (record) {
      results.push(record);
    }
  }
  return results;
}

function getPeriodStart(period: TrendPeriod, now = Date.now()): number {
  switch (period) {
    case "30d":
      return now - 30 * 24 * 60 * 60 * 1000;
    case "90d":
      return now - 90 * 24 * 60 * 60 * 1000;
    case "180d":
      return now - 180 * 24 * 60 * 60 * 1000;
    case "all":
    default:
      return 0;
  }
}

export async function listSharesByPeriod(period: TrendPeriod): Promise<StoredShareV1[]> {
  const all = await listAllShares();
  const from = getPeriodStart(period);
  return all.filter((item) => item.createdAt >= from);
}

export async function getTrendsCache(
  period: TrendPeriod,
  view: TrendView
): Promise<TrendResponse | null> {
  const key = trendCacheKey(period, view);
  if (!KV_ENABLED) {
    const item = getMemoryStore().trendCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      getMemoryStore().trendCache.delete(key);
      return null;
    }
    return item.value;
  }

  const data = await safeKvGet<TrendResponse>(key);
  if (data) {
    return data;
  }

  const fallback = getMemoryStore().trendCache.get(key);
  if (!fallback) return null;
  if (Date.now() > fallback.expiresAt) {
    getMemoryStore().trendCache.delete(key);
    return null;
  }
  return fallback.value;
}

export async function setTrendsCache(
  period: TrendPeriod,
  view: TrendView,
  value: TrendResponse,
  ttlSeconds = 600
): Promise<void> {
  const key = trendCacheKey(period, view);
  getMemoryStore().trendCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  if (!KV_ENABLED) {
    return;
  }

  try {
    await kv.set(key, value, { ex: ttlSeconds });
  } catch {
    // ignore kv failures and keep in-memory cache
  }
}

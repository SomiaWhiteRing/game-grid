import { GameSearchResponse, ShareGame } from "@/lib/share/types";

const BANGUMI_API_BASE_URL = "https://api.bgm.tv";
const BANGUMI_ACCESS_TOKEN = process.env.BANGUMI_ACCESS_TOKEN;
const BANGUMI_USER_AGENT = process.env.BANGUMI_USER_AGENT;

function extractYear(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  const year = Number.parseInt(raw.slice(0, 4), 10);
  if (!Number.isFinite(year) || year < 1970 || year > 2100) {
    return undefined;
  }
  return year;
}

type BangumiSubject = {
  id: number;
  name: string;
  name_cn?: string;
  date?: string;
  images?: {
    large?: string;
    common?: string;
    medium?: string;
  };
  image?: string;
  tags?: Array<{
    name?: string;
  }>;
};

const SEARCH_SUGGESTIONS = [
  "可尝试游戏正式名或别名",
  "中日英名称切换检索通常更有效",
  "减少关键词，仅保留核心词",
];

const PLATFORM_KEYWORDS: Record<string, string> = {
  pc: "PC",
  windows: "PC",
  mac: "Mac",
  linux: "Linux",
  switch: "Nintendo Switch",
  ns: "Nintendo Switch",
  ps5: "PS5",
  ps4: "PS4",
  ps3: "PS3",
  psv: "PS Vita",
  vita: "PS Vita",
  xbox: "Xbox",
  xone: "Xbox One",
  xsx: "Xbox Series X|S",
  steam: "Steam",
  ios: "iOS",
  android: "Android",
  gba: "GBA",
  nds: "NDS",
  "3ds": "3DS",
  wii: "Wii",
  wiiu: "Wii U",
  ps2: "PS2",
  ps1: "PS1",
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function inferPlatforms(tags: Array<{ name?: string }> | undefined): string[] {
  if (!Array.isArray(tags) || tags.length === 0) {
    return [];
  }

  const found = new Set<string>();
  for (const tag of tags) {
    const tagText = normalizeText(tag?.name || "");
    if (!tagText) continue;
    for (const [keyword, label] of Object.entries(PLATFORM_KEYWORDS)) {
      if (tagText.includes(keyword)) {
        found.add(label);
      }
    }
  }

  return Array.from(found).slice(0, 4);
}

function scoreCandidate(query: string, game: ShareGame): number {
  const q = normalizeText(query);
  if (!q) return 0;

  const candidates = [game.localizedName || "", game.name];
  let score = 0;

  for (const text of candidates) {
    const normalized = normalizeText(text);
    if (!normalized) continue;
    if (normalized === q) score += 100;
    if (normalized.startsWith(q)) score += 60;
    if (normalized.includes(q)) score += 25;
  }

  if (typeof game.releaseYear === "number") {
    const yearText = String(game.releaseYear);
    if (yearText.includes(q)) score += 5;
  }

  return score;
}

export function buildBangumiSearchResponse(
  query: string,
  items: ShareGame[]
): GameSearchResponse {
  const ranked = items
    .map((item) => ({
      id: item.id,
      score: scoreCandidate(query, item),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.id);

  const topPickIds = ranked.length > 0 ? ranked : items.slice(0, 2).map((item) => item.id);

  return {
    ok: true,
    source: "bangumi",
    items,
    topPickIds,
    suggestions: SEARCH_SUGGESTIONS,
    noResultQuery: items.length === 0 && query.trim() ? query : null,
  };
}

export async function searchBangumiGames(query: string): Promise<ShareGame[]> {
  const q = query.trim();
  if (!q) {
    return [];
  }

  const url = `${BANGUMI_API_BASE_URL}/search/subject/${encodeURIComponent(
    q
  )}?type=4&responseGroup=small`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": BANGUMI_USER_AGENT || "GameGrid/3.0",
      Accept: "application/json",
      ...(BANGUMI_ACCESS_TOKEN
        ? { Authorization: `Bearer ${BANGUMI_ACCESS_TOKEN}` }
        : {}),
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Bangumi search failed: ${response.status}`);
  }

  const json = await response.json();
  const list: BangumiSubject[] = Array.isArray(json?.list) ? json.list : [];

  return list.slice(0, 20).map((item) => {
    const cover =
      item.images?.large || item.images?.common || item.images?.medium || item.image || null;

    return {
      id: item.id,
      name: item.name,
      localizedName: item.name_cn || undefined,
      cover,
      releaseYear: extractYear(item.date),
      gameTypeId: 0,
      platforms: inferPlatforms(item.tags),
      genres: Array.isArray(item.tags)
        ? item.tags
            .map((tag) => tag?.name?.trim())
            .filter((name): name is string => Boolean(name))
            .slice(0, 3)
        : [],
    } satisfies ShareGame;
  });
}

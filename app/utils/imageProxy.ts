const BANGUMI_IMAGE_PROXY_BASE = "https://my9.shatranj.space/api/image/bgm";
const BANGUMI_IMAGE_HOSTS = new Set(["lain.bgm.tv", "img.bgm.tv"]);
const STEAMGRIDDB_IMAGE_HOSTS = new Set(["cdn2.steamgriddb.com"]);

export function toProxiedBangumiImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  const raw = value.trim();
  if (!raw) return null;
  if (raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  const normalized = raw.startsWith("//") ? `https:${raw}` : raw;

  if (normalized.startsWith("/")) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    if (STEAMGRIDDB_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())) {
      parsed.protocol = "https:";
      parsed.hash = "";
      return `/api/proxy?url=${encodeURIComponent(parsed.toString())}`;
    }

    if (!BANGUMI_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())) {
      return raw;
    }

    parsed.protocol = "https:";
    parsed.hash = "";
    return `${BANGUMI_IMAGE_PROXY_BASE}?url=${encodeURIComponent(parsed.toString())}`;
  } catch {
    return raw;
  }
}

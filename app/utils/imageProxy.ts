const BANGUMI_IMAGE_PROXY_BASE = "https://my9.shatranj.space/api/image/bgm";
const BANGUMI_IMAGE_HOSTS = new Set(["lain.bgm.tv", "img.bgm.tv"]);
const STEAMGRIDDB_IMAGE_HOSTS = new Set(["cdn2.steamgriddb.com"]);

// Search previews do not touch a canvas, so they can load without CORS.
// Keep the existing proxy for full-resolution selection, cropping and export.
export function getSearchImageSources(
  image: string | null | undefined,
  thumbnail?: string | null,
): string[] {
  const originalProxy = toProxiedBangumiImageUrl(image);
  if (!originalProxy) return [];

  const toSteamGridUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;
    try {
      const url = new URL(value.trim().replace(/^\/\//, "https://"));
      if (!STEAMGRIDDB_IMAGE_HOSTS.has(url.hostname.toLowerCase()) ||
          (url.protocol !== "https:" && url.protocol !== "http:")) return null;
      url.protocol = "https:";
      url.hash = "";
      return url.toString();
    } catch {
      return null;
    }
  };

  const directOriginal = toSteamGridUrl(image);
  if (!directOriginal) return [originalProxy];

  const directThumbnail = toSteamGridUrl(thumbnail);
  const sources = directThumbnail
    ? [directThumbnail, toProxiedBangumiImageUrl(directThumbnail), originalProxy]
    : [directOriginal, originalProxy];

  return Array.from(new Set(sources.filter((source): source is string => Boolean(source))));
}

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

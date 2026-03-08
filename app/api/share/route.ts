import { NextResponse } from "next/server";
import { createShareId, normalizeShareId } from "@/lib/share/id";
import { saveShare, getShare } from "@/lib/share/storage";
import { GameTypeId, ShareGame, StoredShareV1 } from "@/lib/share/types";

const MAX_CREATOR_LENGTH = 40;
const MAX_COMMENT_LENGTH = 140;
const VALID_GAME_TYPES = new Set<GameTypeId>([0, 1, 2, 3, 4, 8, 9, 10, 11]);

function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function sanitizeGame(input: any): ShareGame | null {
  if (!input || typeof input !== "object") return null;

  const name = sanitizeString(input.name);
  if (!name) return null;

  const id =
    typeof input.id === "number" || typeof input.id === "string"
      ? input.id
      : String(name);
  const coverRaw = input.cover;
  const cover = typeof coverRaw === "string" && coverRaw.trim() ? coverRaw.trim() : null;

  const commentRaw = sanitizeString(input.comment);
  const comment = commentRaw ? commentRaw.slice(0, MAX_COMMENT_LENGTH) : undefined;
  const spoiler = Boolean(input.spoiler);

  const releaseYear =
    typeof input.releaseYear === "number" && Number.isFinite(input.releaseYear)
      ? Math.trunc(input.releaseYear)
      : undefined;

  const gameTypeId =
    typeof input.gameTypeId === "number" && VALID_GAME_TYPES.has(input.gameTypeId as GameTypeId)
      ? (input.gameTypeId as GameTypeId)
      : undefined;

  const localizedName = sanitizeString(input.localizedName) || undefined;
  const platforms = Array.isArray(input.platforms)
    ? input.platforms
        .map((item: unknown) => sanitizeString(item))
        .filter((item: string) => Boolean(item))
    : undefined;
  const genres = Array.isArray(input.genres)
    ? input.genres
        .map((item: unknown) => sanitizeString(item))
        .filter((item: string) => Boolean(item))
        .slice(0, 5)
    : undefined;

  const storeUrls =
    input.storeUrls && typeof input.storeUrls === "object"
      ? Object.fromEntries(
          Object.entries(input.storeUrls as Record<string, unknown>).flatMap(
            ([key, value]) => {
              const cleanKey = sanitizeString(key);
              const cleanValue = sanitizeString(value);
              if (!cleanKey || !cleanValue) return [];
              return [[cleanKey, cleanValue]];
            }
          )
        )
      : undefined;

  return {
    id,
    name,
    localizedName,
    cover,
    releaseYear,
    gameTypeId,
    platforms,
    genres,
    storeUrls,
    comment,
    spoiler,
  };
}

function parseGames(input: unknown): Array<ShareGame | null> | null {
  if (!Array.isArray(input) || input.length !== 9) return null;
  return input.map((item) => sanitizeGame(item));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const creatorNameRaw = sanitizeString(body?.creatorName);
    const creatorName = creatorNameRaw ? creatorNameRaw.slice(0, MAX_CREATOR_LENGTH) : null;
    const games = parseGames(body?.games);

    if (!games) {
      return NextResponse.json(
        {
          ok: false,
          error: "games 参数必须是长度为 9 的数组",
          code: "invalid_games",
        },
        { status: 400 }
      );
    }

    const shareId = createShareId();
    const now = Date.now();
    const record: StoredShareV1 = {
      shareId,
      creatorName,
      games,
      createdAt: now,
      updatedAt: now,
      lastViewedAt: now,
    };

    await saveShare(record);
    const origin = new URL(request.url).origin;
    const shareUrl = `${origin}/s/${shareId}`;

    return NextResponse.json({
      ok: true,
      shareId,
      shareUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "保存失败",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = normalizeShareId(searchParams.get("id"));
  if (!id) {
    return NextResponse.json(
      {
        ok: false,
        error: "无效的分享 ID",
      },
      { status: 400 }
    );
  }

  const share = await getShare(id);
  if (!share) {
    return NextResponse.json(
      {
        ok: false,
        error: "分享不存在",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    ...share,
  });
}

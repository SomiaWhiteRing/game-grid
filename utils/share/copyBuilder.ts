import { ShareGame } from "@/lib/share/types";

export function pickDisplayName(game: ShareGame): string {
  const localized = game.localizedName?.trim();
  if (localized) {
    return localized;
  }
  return game.name.trim();
}

export function buildGameLines(games: Array<ShareGame | null>): string[] {
  return games
    .map((game, index) => {
      if (!game) return null;
      return `${index + 1}. ${pickDisplayName(game)}`;
    })
    .filter((line): line is string => Boolean(line));
}

export function buildShareTitle(creatorName?: string | null): string {
  const name = creatorName?.trim();
  if (!name) {
    return "构成我的9款游戏";
  }
  return `${name}｜构成我的9款游戏`;
}

export function buildXShareText(
  shareUrl: string,
  games: Array<ShareGame | null>,
  creatorName?: string | null,
  options?: {
    includeTitles?: boolean;
  }
): string {
  const lines = buildGameLines(games);
  const title = buildShareTitle(creatorName);
  const includeTitles = options?.includeTitles ?? true;
  if (!includeTitles || lines.length === 0) {
    return `${title}\n#构成我的9款游戏 #GameGrid\n${shareUrl}`;
  }
  return `${title}\n${lines.join("\n")}\n#构成我的9款游戏 #GameGrid\n${shareUrl}`;
}

export function buildBilibiliCopyText(
  shareUrl: string,
  games: Array<ShareGame | null>,
  creatorName?: string | null
): string {
  const title = buildShareTitle(creatorName);
  const lines = buildGameLines(games);
  if (lines.length === 0) {
    return `${title}\n来看看我构成的9款游戏：${shareUrl}\n#构成我的9款游戏# #游戏推荐#`;
  }
  return `${title}\n${lines.join("\n")}\n来看看我构成的9款游戏：${shareUrl}\n#构成我的9款游戏# #游戏推荐#`;
}

export function buildWeiboText(
  shareUrl: string,
  games: Array<ShareGame | null>,
  creatorName?: string | null
): string {
  const title = buildShareTitle(creatorName);
  const lines = buildGameLines(games);
  if (lines.length === 0) {
    return `${title}，快来围观👉 ${shareUrl} #构成我的9款游戏#`;
  }
  return `${title}\n${lines.join("；")}\n${shareUrl} #构成我的9款游戏#`;
}

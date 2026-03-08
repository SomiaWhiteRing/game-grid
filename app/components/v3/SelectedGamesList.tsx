"use client";

import { AlertTriangle, Globe, MessageCircle } from "lucide-react";
import { ShareGame } from "@/lib/share/types";

interface SelectedGamesListProps {
  games: Array<ShareGame | null>;
  readOnly: boolean;
  spoilerExpandedSet: Set<number>;
  onToggleSpoiler: (index: number) => void;
  onOpenComment: (index: number) => void;
}

function displayName(game: ShareGame): string {
  return game.localizedName?.trim() || game.name;
}

function bangumiLink(game: ShareGame): string {
  const id = String(game.id || "").trim();
  if (/^\d+$/.test(id)) {
    return `https://bgm.tv/subject/${id}`;
  }
  const query = encodeURIComponent(displayName(game));
  return `https://bgm.tv/subject_search/${query}?cat=4`;
}

export function SelectedGamesList({
  games,
  readOnly,
  spoilerExpandedSet,
  onToggleSpoiler,
  onOpenComment,
}: SelectedGamesListProps) {
  const selected = games
    .map((game, index) => ({ index, game }))
    .filter((item): item is { index: number; game: ShareGame } => Boolean(item.game));

  return (
    <section className="w-full max-w-2xl px-1 sm:px-4">
      <div className="mb-6 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800">选择的游戏</h2>
      </div>

      <div className="space-y-6">
        {selected.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">还没有选择任何游戏。</p>
        ) : null}

        {selected.map(({ index, game }) => {
          const spoilerCollapsed = Boolean(game.spoiler) && !spoilerExpandedSet.has(index);
          return (
            <article
              key={`${String(game.id)}-${index}`}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-md"
            >
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="-ml-1 -mt-1 w-6 flex-shrink-0 text-center font-mono text-xl font-bold text-sky-400 sm:-ml-1.5">
                  {index + 1}
                </div>

                <div className="-ml-0.5 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm sm:-ml-1 sm:w-16">
                  {game.cover ? (
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center text-[11px] text-gray-400">
                      无图
                    </div>
                  )}
                </div>

                <div className="-mt-0.5 min-w-0 flex-1 sm:-mt-1">
                  <h3 className="mb-1 whitespace-normal break-words text-sm font-bold text-gray-800 sm:mb-2 sm:text-lg">
                    {displayName(game)}
                    {game.releaseYear ? ` (${game.releaseYear})` : ""}
                  </h3>
                  {game.localizedName && game.localizedName.trim() !== game.name ? (
                    <p className="-mt-1 mb-2 whitespace-normal break-words text-xs text-gray-500 sm:text-sm">
                      {game.name}
                    </p>
                  ) : null}

                  {game.comment ? (
                    <div className="mt-1">
                      {spoilerCollapsed ? (
                        <button
                          type="button"
                          onClick={() => onToggleSpoiler(index)}
                          className="flex w-full items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-left text-xs text-amber-800 transition hover:bg-amber-100"
                        >
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{readOnly ? "包含剧透内容，点击确认后展开" : "剧透评论已折叠，点击展开预览"}</span>
                        </button>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-xs text-gray-600 sm:text-sm">
                          {game.comment}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="-mt-0.5 flex flex-col items-center gap-1 self-start sm:-mt-1">
                  <a
                    href={bangumiLink(game)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="在 Bangumi 查看"
                    className="rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Globe className="h-4 w-4" />
                  </a>

                  {!readOnly ? (
                    <button
                      type="button"
                      onClick={() => onOpenComment(index)}
                      className="rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      aria-label={`编辑第 ${index + 1} 格评论`}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

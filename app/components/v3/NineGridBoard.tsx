"use client";

import { MessageSquare, Plus, X } from "lucide-react";
import { ShareGame } from "@/lib/share/types";
import { cn } from "@/lib/utils";

interface NineGridBoardProps {
  games: Array<ShareGame | null>;
  readOnly: boolean;
  onSelectSlot: (index: number) => void;
  onRemoveSlot: (index: number) => void;
  onOpenComment: (index: number) => void;
}

function displayTitle(game: ShareGame) {
  return game.localizedName?.trim() || game.name;
}

export function NineGridBoard({
  games,
  readOnly,
  onSelectSlot,
  onRemoveSlot,
  onOpenComment,
}: NineGridBoardProps) {
  return (
    <div className="mx-auto grid grid-cols-3 gap-3">
      {games.map((game, index) => (
        <div key={index} className="group relative">
          <div
            role={readOnly ? undefined : "button"}
            tabIndex={readOnly ? undefined : 0}
            aria-label={readOnly ? undefined : `选择第 ${index + 1} 格游戏`}
            onClick={() => {
              if (readOnly) return;
              onSelectSlot(index);
            }}
            onKeyDown={(event) => {
              if (readOnly) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectSlot(index);
              }
            }}
            className={cn(
              "relative flex aspect-[3/4] w-24 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-colors sm:w-32 md:w-36",
              !readOnly && "cursor-pointer hover:border-sky-200"
            )}
          >
            {game?.cover ? (
              <img
                src={game.cover}
                alt={displayTitle(game)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs font-medium text-gray-400">
                <Plus className="h-4 w-4" />
                <span>选择</span>
              </div>
            )}

            <div className="absolute left-1.5 top-1 text-[10px] font-semibold text-gray-300">
              {index + 1}
            </div>
          </div>

          {game && !readOnly ? (
            <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                aria-label={`编辑第 ${index + 1} 格评论`}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenComment(index);
                }}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-sky-600"
              >
                <MessageSquare className="h-3 w-3" />
              </button>
              <button
                type="button"
                aria-label={`移除第 ${index + 1} 格游戏`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveSlot(index);
                }}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-rose-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

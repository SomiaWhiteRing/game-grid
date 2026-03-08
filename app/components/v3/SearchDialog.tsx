"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { AlertCircle, Gamepad2, Loader2, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShareGame } from "@/lib/share/types";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (value: string) => void;
  loading: boolean;
  error: string;
  results: ShareGame[];
  topPickIds: Array<string | number>;
  suggestions: string[];
  noResultQuery: string | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSubmitSearch: () => void;
  onPickGame: (game: ShareGame) => void;
}

type ViewState = "idle" | "searching" | "success" | "error" | "no-results";

function displayName(game: ShareGame) {
  return game.localizedName?.trim() || game.name;
}

function toIdKey(value: string | number) {
  return String(value);
}

export function SearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  loading,
  error,
  results,
  topPickIds,
  suggestions,
  noResultQuery,
  activeIndex,
  onActiveIndexChange,
  onSubmitSearch,
  onPickGame,
}: SearchDialogProps) {
  const pendingConfirmRef = useRef(false);
  const trimmedQuery = query.trim();

  const orderedResults = useMemo(() => {
    if (results.length === 0 || topPickIds.length === 0) {
      return results;
    }

    const topSet = new Set(topPickIds.map(toIdKey));
    const top: ShareGame[] = [];
    const rest: ShareGame[] = [];

    for (const item of results) {
      if (topSet.has(String(item.id))) {
        top.push(item);
      } else {
        rest.push(item);
      }
    }

    return [...top, ...rest];
  }, [results, topPickIds]);

  const state: ViewState = useMemo(() => {
    if (loading) return "searching";
    if (error) return "error";
    if (trimmedQuery.length === 0) return "idle";
    if (orderedResults.length > 0) return "success";
    if (trimmedQuery.length > 0 || noResultQuery) return "no-results";
    return "idle";
  }, [error, loading, noResultQuery, orderedResults.length, trimmedQuery]);

  useEffect(() => {
    if (!open) {
      pendingConfirmRef.current = false;
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (orderedResults.length === 0) {
      if (activeIndex !== -1) {
        onActiveIndexChange(-1);
      }
      return;
    }

    if (activeIndex < 0 || activeIndex >= orderedResults.length) {
      onActiveIndexChange(0);
    }
  }, [activeIndex, onActiveIndexChange, open, orderedResults.length]);

  useEffect(() => {
    if (!open || !pendingConfirmRef.current || orderedResults.length === 0) {
      return;
    }

    pendingConfirmRef.current = false;
    const targetIndex =
      activeIndex >= 0 && activeIndex < orderedResults.length ? activeIndex : 0;
    onPickGame(orderedResults[targetIndex]);
  }, [activeIndex, onPickGame, open, orderedResults]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle>搜索游戏</DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="关闭搜索弹窗"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">来源：Bangumi</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={query}
                role="combobox"
                aria-expanded={open}
                aria-controls="search-results-list"
                aria-label="游戏搜索输入框"
                placeholder="输入游戏名"
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (orderedResults.length === 0) return;
                    const nextIndex = Math.min((activeIndex < 0 ? -1 : activeIndex) + 1, orderedResults.length - 1);
                    onActiveIndexChange(nextIndex);
                    return;
                  }

                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    if (orderedResults.length === 0) return;
                    const nextIndex = Math.max((activeIndex < 0 ? 0 : activeIndex) - 1, 0);
                    onActiveIndexChange(nextIndex);
                    return;
                  }

                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (activeIndex >= 0 && orderedResults[activeIndex]) {
                      pendingConfirmRef.current = false;
                      onPickGame(orderedResults[activeIndex]);
                      return;
                    }
                    if (trimmedQuery.length >= 2) {
                      pendingConfirmRef.current = true;
                    }
                    onSubmitSearch();
                    return;
                  }

                  if (event.key === "Escape") {
                    onOpenChange(false);
                  }
                }}
                disabled={loading}
                className="pr-8"
                autoFocus
              />
              {query ? (
                <button
                  type="button"
                  aria-label="清空搜索"
                  onClick={() => {
                    onQueryChange("");
                    onActiveIndexChange(-1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  ✕
                </button>
              ) : null}
            </div>
            <Button type="button" onClick={onSubmitSearch} disabled={loading || query.trim().length < 2}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  搜索中
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-h-[40vh] overflow-y-auto sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px]" id="search-results-list" role="listbox">
          {state === "success" ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {orderedResults.map((game, index) => (
                <button
                  key={`${String(game.id)}-${index}`}
                  type="button"
                  onMouseEnter={() => onActiveIndexChange(index)}
                  onClick={() => onPickGame(game)}
                  className={cn(
                    "cursor-pointer rounded border p-1 transition-colors sm:p-2",
                    index === activeIndex
                      ? "border-sky-300 bg-sky-50"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                  title={displayName(game)}
                >
                  <div className="relative h-0 w-full overflow-hidden rounded bg-gray-100 pb-[133.33%]">
                    {game.cover ? (
                      <Image
                        src={game.cover}
                        alt={displayName(game)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 40vw, 20vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gamepad2 className="h-7 w-7 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs sm:mt-2 sm:text-sm">{displayName(game)}</p>
                </button>
              ))}
            </div>
          ) : (
            <SearchStatus
              state={state}
              error={error}
              loading={loading}
              noResultQuery={noResultQuery}
              suggestions={suggestions}
              onRetry={onSubmitSearch}
            />
          )}
        </div>

        <DialogFooter className="mt-2 flex flex-col justify-between border-t pt-2 sm:flex-row sm:justify-between">
          <div className="mb-2 text-xs text-gray-500 sm:mb-0">
            {orderedResults.length > 0 ? `共 ${orderedResults.length} 条结果` : ""}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="hidden sm:inline-flex"
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SearchStatus(props: {
  state: Exclude<ViewState, "success">;
  error: string;
  loading: boolean;
  noResultQuery: string | null;
  suggestions: string[];
  onRetry: () => void;
}) {
  const { state, error, loading, noResultQuery, suggestions, onRetry } = props;

  if (state === "searching") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500" aria-live="polite">
        <Loader2 className="mb-2 h-8 w-8 animate-spin" />
        <p>正在搜索...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-red-500" aria-live="polite">
        <AlertCircle className="mb-2 h-8 w-8" />
        <p>{error || "搜索失败，请检查网络连接后重试"}</p>
        <Button variant="outline" className="mt-4" onClick={onRetry} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重试
        </Button>
      </div>
    );
  }

  if (state === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500" aria-live="polite">
        <Gamepad2 className="mb-2 h-8 w-8 opacity-50" />
        <p>{noResultQuery ? `未找到“${noResultQuery}”` : "未找到相关游戏"}</p>
        <p className="mt-2 text-sm">{(suggestions[0] || "尝试更换关键词后重试").replace(/^[\-•]\s*/, "")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500" aria-live="polite">
      <Search className="mb-2 h-12 w-12 opacity-30" />
      <p>输入游戏名称开始搜索</p>
    </div>
  );
}

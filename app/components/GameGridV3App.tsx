"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SharePlatformActions } from "@/components/share/SharePlatformActions";
import { ActionCluster } from "@/app/components/v3/ActionCluster";
import { CommentDialog } from "@/app/components/v3/CommentDialog";
import { InlineToast, ToastKind } from "@/app/components/v3/InlineToast";
import { NineGridBoard } from "@/app/components/v3/NineGridBoard";
import { SearchDialog } from "@/app/components/v3/SearchDialog";
import { SelectedGamesList } from "@/app/components/v3/SelectedGamesList";
import { GameSearchResponse, ShareGame } from "@/lib/share/types";

type ToastState = {
  kind: ToastKind;
  message: string;
} | null;

type DraftSnapshot = {
  games: Array<ShareGame | null>;
  creatorName: string;
};

type SearchMeta = {
  topPickIds: Array<string | number>;
  suggestions: string[];
  noResultQuery: string | null;
};

const DRAFT_STORAGE_KEY = "my-nine-games:v1";
const DEFAULT_SEARCH_SUGGESTIONS = [
  "可尝试游戏正式名或别名",
  "中日英名称切换检索通常更有效",
  "减少关键词，仅保留核心词",
];

function createEmptyGames() {
  return Array.from({ length: 9 }, () => null as ShareGame | null);
}

function cloneGames(games: Array<ShareGame | null>) {
  return games.map((item) => (item ? { ...item } : null));
}

interface GameGridV3AppProps {
  initialShareId?: string | null;
  readOnlyShare?: boolean;
}

export default function GameGridV3App({
  initialShareId = null,
  readOnlyShare = false,
}: GameGridV3AppProps) {
  const router = useRouter();

  const [games, setGames] = useState<Array<ShareGame | null>>(createEmptyGames());
  const [creatorName, setCreatorName] = useState("");
  const [shareId, setShareId] = useState<string | null>(initialShareId);
  const [loadingShare, setLoadingShare] = useState(Boolean(initialShareId));
  const [savingShare, setSavingShare] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);
  const [singleUndoSnapshot, setSingleUndoSnapshot] = useState<DraftSnapshot | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState<ShareGame[]>([]);
  const [searchActiveIndex, setSearchActiveIndex] = useState(-1);
  const [searchMeta, setSearchMeta] = useState<SearchMeta>({
    topPickIds: [],
    suggestions: DEFAULT_SEARCH_SUGGESTIONS,
    noResultQuery: null,
  });

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSpoiler, setCommentSpoiler] = useState(false);
  const [commentSlot, setCommentSlot] = useState<number | null>(null);
  const [spoilerExpandedSet, setSpoilerExpandedSet] = useState<Set<number>>(new Set());

  const filledCount = useMemo(() => games.filter((item) => item !== null).length, [games]);
  const allSelected = filledCount === 9;
  const isReadonly = readOnlyShare;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!initialShareId) return;
    let active = true;

    async function loadShared() {
      setLoadingShare(true);
      try {
        const response = await fetch(`/api/share?id=${encodeURIComponent(initialShareId)}`, {
          cache: "no-store",
        });
        const json = await response.json();
        if (!active) return;
        if (!response.ok || !json?.ok) {
          setToast({ kind: "error", message: json?.error || "共享页面加载失败" });
          setLoadingShare(false);
          return;
        }

        const payloadGames = Array.isArray(json.games) ? json.games : createEmptyGames();
        setGames(payloadGames.length === 9 ? payloadGames : createEmptyGames());
        setCreatorName(typeof json.creatorName === "string" ? json.creatorName : "");
        setShareId(json.shareId || initialShareId);
      } catch {
        if (!active) return;
        setToast({ kind: "error", message: "共享页面加载失败" });
      } finally {
        if (active) {
          setLoadingShare(false);
        }
      }
    }

    loadShared();
    return () => {
      active = false;
    };
  }, [initialShareId]);

  useEffect(() => {
    if (isReadonly || initialShareId) {
      setDraftHydrated(true);
      return;
    }

    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const savedGames = Array.isArray(parsed?.games) ? parsed.games : null;
        if (savedGames && savedGames.length === 9) {
          setGames(savedGames);
        }
        if (typeof parsed?.creatorName === "string") {
          setCreatorName(parsed.creatorName);
        }
      }
    } catch {
      // ignore invalid local draft
    } finally {
      setDraftHydrated(true);
    }
  }, [initialShareId, isReadonly]);

  useEffect(() => {
    if (isReadonly || initialShareId || !draftHydrated) return;
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          games,
          creatorName,
        })
      );
    } catch {
      // ignore write errors
    }
  }, [games, creatorName, draftHydrated, initialShareId, isReadonly]);

  useEffect(() => {
    if (!shareId || !isReadonly) return;
    fetch(`/api/share/touch?id=${encodeURIComponent(shareId)}`, {
      method: "POST",
      cache: "no-store",
    }).catch(() => {});
  }, [shareId, isReadonly]);

  function pushToast(kind: ToastKind, message: string) {
    setToast({ kind, message });
  }

  function makeUndoSnapshot() {
    setSingleUndoSnapshot({
      games: cloneGames(games),
      creatorName,
    });
  }

  function guardReadonly() {
    if (!isReadonly) return false;
    pushToast("info", "共享页面不可编辑");
    return true;
  }

  function updateSlot(index: number, game: ShareGame | null) {
    makeUndoSnapshot();
    setGames((prev) => {
      const next = [...prev];
      next[index] = game;
      return next;
    });

    setSpoilerExpandedSet((prev) => {
      if (!prev.has(index)) return prev;
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  function handleUndo() {
    if (guardReadonly()) return;
    if (!singleUndoSnapshot) return;
    setGames(singleUndoSnapshot.games);
    setCreatorName(singleUndoSnapshot.creatorName);
    setSingleUndoSnapshot(null);
    setSpoilerExpandedSet(new Set());
    pushToast("success", "已撤销上一步操作");
  }

  function handleClear() {
    if (guardReadonly()) return;
    if (filledCount === 0) return;
    makeUndoSnapshot();
    setGames(createEmptyGames());
    setSpoilerExpandedSet(new Set());
    pushToast("info", "已清空已选游戏");
  }

  async function handleSearch() {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchError("至少输入 2 个字符");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchActiveIndex(0);

    try {
      const response = await fetch(`/api/games/search?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const json = (await response.json()) as Partial<GameSearchResponse> & {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !json?.ok) {
        setSearchError(json?.error || "搜索失败，请稍后再试");
        setSearchResults([]);
        setSearchMeta({
          topPickIds: [],
          suggestions: DEFAULT_SEARCH_SUGGESTIONS,
          noResultQuery: q,
        });
        return;
      }

      setSearchResults(Array.isArray(json.items) ? json.items : []);
      setSearchMeta({
        topPickIds: Array.isArray(json.topPickIds) ? json.topPickIds : [],
        suggestions:
          Array.isArray(json.suggestions) && json.suggestions.length > 0
            ? json.suggestions
            : DEFAULT_SEARCH_SUGGESTIONS,
        noResultQuery: typeof json.noResultQuery === "string" ? json.noResultQuery : null,
      });
      setSearchActiveIndex(0);
    } catch {
      setSearchError("搜索失败，请稍后再试");
      setSearchResults([]);
      setSearchMeta({
        topPickIds: [],
        suggestions: DEFAULT_SEARCH_SUGGESTIONS,
        noResultQuery: q,
      });
    } finally {
      setSearchLoading(false);
    }
  }

  function openSearch(index: number) {
    if (guardReadonly()) return;
    setSelectedSlot(index);
    setSearchQuery("");
    setSearchError("");
    setSearchResults([]);
    setSearchActiveIndex(-1);
    setSearchMeta({
      topPickIds: [],
      suggestions: DEFAULT_SEARCH_SUGGESTIONS,
      noResultQuery: null,
    });
    window.setTimeout(() => setSearchOpen(true), 0);
  }

  function selectSearchResult(game: ShareGame) {
    if (selectedSlot === null) return;

    const duplicateIndex = games.findIndex(
      (item, index) => index !== selectedSlot && item && String(item.id) === String(game.id)
    );

    if (duplicateIndex >= 0) {
      const name = game.localizedName?.trim() || game.name;
      pushToast("info", `《${name}》已在第 ${duplicateIndex + 1} 格选中`);
      return;
    }

    updateSlot(selectedSlot, {
      ...game,
      comment: games[selectedSlot]?.comment,
      spoiler: games[selectedSlot]?.spoiler,
    });

    setSearchOpen(false);
    setSelectedSlot(null);
    pushToast("success", `已填入第 ${selectedSlot + 1} 格`);
  }

  function openComment(index: number) {
    if (guardReadonly()) return;
    const game = games[index];
    if (!game) return;

    setCommentSlot(index);
    setCommentText(game.comment || "");
    setCommentSpoiler(Boolean(game.spoiler));
    setCommentOpen(true);
  }

  function saveComment() {
    if (commentSlot === null) return;
    const game = games[commentSlot];
    if (!game) return;

    updateSlot(commentSlot, {
      ...game,
      comment: commentText.trim().slice(0, 140),
      spoiler: commentSpoiler,
    });

    setCommentOpen(false);
    pushToast("success", "评论已保存");
  }

  async function handleSaveShare() {
    if (guardReadonly()) return;
    if (!allSelected) {
      const confirmed = window.confirm(
        `当前仅选择了 ${filledCount}/9 个游戏，确认继续保存吗？`
      );
      if (!confirmed) return;
    }

    setSavingShare(true);
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName: creatorName.trim() || null,
          games,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json?.ok) {
        pushToast("error", json?.error || "分享创建失败");
        return;
      }

      setShareId(json.shareId);
      pushToast("success", "分享页面已创建");
      const target = `/s/${json.shareId}`;
      router.replace(target);
      window.setTimeout(() => {
        if (window.location.pathname !== target) {
          window.location.assign(target);
        }
      }, 120);
    } catch {
      pushToast("error", "分享创建失败，请稍后重试");
    } finally {
      setSavingShare(false);
    }
  }

  function handleNotice(kind: ToastKind, message: string) {
    pushToast(kind, message);
  }

  function handleToggleSpoiler(index: number) {
    const game = games[index];
    if (!game || !game.spoiler) return;

    if (isReadonly && !spoilerExpandedSet.has(index)) {
      const confirmed = window.confirm("包含剧透内容，确认展开吗？");
      if (!confirmed) return;
    }

    setSpoilerExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-16 text-gray-800">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-800 sm:text-4xl">
            构成我的9款游戏
          </h1>
          <p className="text-sm text-gray-500">把你最爱的游戏分享给大家。</p>
        </header>

        {toast ? <InlineToast kind={toast.kind} message={toast.message} /> : null}

        {isReadonly ? (
          <div className="flex flex-col items-center gap-2">
            <p className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700">
              这是共享页面（只读）
            </p>
            <p className="text-sm text-gray-600">创作者: {creatorName.trim() || "匿名玩家"}</p>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => router.push("/")}
            >
              从空白重新开始
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl">
            <label className="mb-2 block text-sm font-semibold text-gray-700">创作者名（可选）</label>
            <Input
              value={creatorName}
              onChange={(event) => setCreatorName(event.target.value.slice(0, 40))}
              placeholder="输入你的昵称"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-sky-200"
            />
            <p className="mt-1 text-right text-xs text-gray-400">{creatorName.length}/40</p>
          </div>
        )}

        {loadingShare ? (
          <p className="text-sm text-gray-500">正在加载共享页面...</p>
        ) : (
          <div className="mx-auto w-fit rounded-xl border-4 border-white bg-white p-4 shadow-2xl ring-1 ring-gray-100">
            <NineGridBoard
              games={games}
              readOnly={isReadonly}
              onSelectSlot={openSearch}
              onRemoveSlot={(index) => {
                if (guardReadonly()) return;
                updateSlot(index, null);
              }}
              onOpenComment={openComment}
            />
          </div>
        )}

        <ActionCluster
          filledCount={filledCount}
          readOnly={isReadonly}
          saving={savingShare}
          canUndo={Boolean(singleUndoSnapshot)}
          canClear={filledCount > 0}
          onUndo={handleUndo}
          onClear={handleClear}
          onSave={handleSaveShare}
        />

        {isReadonly ? (
          <div className="flex w-full flex-col items-center gap-3">
            <SharePlatformActions
              shareId={shareId}
              games={games}
              creatorName={creatorName}
              onNotice={handleNotice}
            />
          </div>
        ) : null}

        <SelectedGamesList
          games={games}
          readOnly={isReadonly}
          spoilerExpandedSet={spoilerExpandedSet}
          onToggleSpoiler={handleToggleSpoiler}
          onOpenComment={openComment}
        />

        <footer className="w-full max-w-2xl border-t border-slate-500 pt-8 text-center text-xs text-slate-500">
          <p className="mb-2">
            <a href="/privacy-policy" className="hover:text-sky-500 hover:underline">
              隐私政策
            </a>
            <span className="mx-1">|</span>
            <a href="/agreement" className="hover:text-sky-500 hover:underline">
              使用条款
            </a>
            <span className="mx-1">|</span>
            <a href="/commercial-disclosure" className="hover:text-sky-500 hover:underline">
              商业声明
            </a>
          </p>
          <p>© 2026 My 9 Games | 构成我的9款游戏</p>
        </footer>
      </div>

      <SearchDialog
        open={searchOpen}
        onOpenChange={(open) => {
          setSearchOpen(open);
          if (!open) {
            setSelectedSlot(null);
          }
        }}
        query={searchQuery}
        onQueryChange={(value) => {
          setSearchQuery(value);
          setSearchError("");
          setSearchActiveIndex(-1);
        }}
        loading={searchLoading}
        error={searchError}
        results={searchResults}
        topPickIds={searchMeta.topPickIds}
        suggestions={searchMeta.suggestions}
        noResultQuery={searchMeta.noResultQuery}
        activeIndex={searchActiveIndex}
        onActiveIndexChange={setSearchActiveIndex}
        onSubmitSearch={handleSearch}
        onPickGame={selectSearchResult}
      />

      <CommentDialog
        open={commentOpen}
        onOpenChange={setCommentOpen}
        value={commentText}
        spoiler={commentSpoiler}
        onChangeValue={setCommentText}
        onChangeSpoiler={setCommentSpoiler}
        onSave={saveComment}
      />
    </main>
  );
}



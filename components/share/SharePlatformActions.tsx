"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareImagePreviewDialog } from "@/components/share/ShareImagePreviewDialog";
import { ShareGame } from "@/lib/share/types";

type NoticeKind = "success" | "error" | "info";

interface SharePlatformActionsProps {
  shareId: string | null;
  games: Array<ShareGame | null>;
  creatorName?: string | null;
  onNotice: (kind: NoticeKind, message: string) => void;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function SharePlatformActions({
  shareId,
  games,
  creatorName,
  onNotice,
}: SharePlatformActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const shareUrl = useMemo(() => {
    if (!shareId) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/s/${shareId}`;
  }, [shareId]);

  const shareTitle = useMemo(() => {
    const name = creatorName?.trim();
    if (!name) return "构成我的9款游戏";
    return `构成我的9款游戏｜${name}`;
  }, [creatorName]);

  const disabled = !shareId;

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45 bg-white border-gray-200 text-gray-700 hover:bg-gray-50";

  return (
    <div className="grid w-full max-w-[42rem] grid-cols-1 gap-3 sm:grid-cols-2">
      <Button
        variant="outline"
        className={baseClass}
        data-testid="share-generate-link"
        disabled={disabled}
        onClick={async () => {
          if (!shareUrl) return;
          try {
            await copyText(shareUrl);
            onNotice("success", "已生成并复制分享链接");
          } catch {
            onNotice("error", "生成分享链接失败，请手动复制");
          }
        }}
      >
        生成分享链接
      </Button>

      <Button
        variant="default"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-45"
        data-testid="share-generate-image"
        disabled={disabled}
        onClick={() => {
          if (!shareId) return;
          setPreviewOpen(true);
        }}
      >
        生成分享图片
      </Button>

      {shareId ? (
        <ShareImagePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          shareId={shareId}
          title={shareTitle}
          games={games}
          creatorName={creatorName}
          onNotice={onNotice}
        />
      ) : null}
    </div>
  );
}

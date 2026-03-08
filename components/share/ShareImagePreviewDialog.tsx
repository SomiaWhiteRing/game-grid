"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ShareGame } from "@/lib/share/types";
import {
  downloadBlob,
  generateStandardShareImageBlob,
  generateBilibiliCardBlob,
} from "@/utils/image/exportBilibiliCard";

type NoticeKind = "success" | "error" | "info";

interface ShareImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareId: string;
  title: string;
  games: Array<ShareGame | null>;
  creatorName?: string | null;
  onNotice: (kind: NoticeKind, message: string) => void;
}

function buildFileName(title: string, withQr: boolean) {
  const suffix = withQr ? "分享图-二维码版" : "分享图";
  return `${title || "构成我的9款游戏"}-${suffix}.png`;
}

export function ShareImagePreviewDialog({
  open,
  onOpenChange,
  shareId,
  title,
  games,
  creatorName,
  onNotice,
}: ShareImagePreviewDialogProps) {
  const [withQr, setWithQr] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewError, setPreviewError] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open) {
      setWithQr(true);
      setLoading(false);
      setPreviewBlob(null);
      setPreviewError("");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const requestId = ++requestIdRef.current;

    async function loadPreview() {
      setLoading(true);
      setPreviewError("");
      try {
        const blob = withQr
          ? await generateBilibiliCardBlob({ shareId, title, games, creatorName })
          : await generateStandardShareImageBlob({ games, creatorName });

        if (requestId !== requestIdRef.current) return;
        const nextUrl = URL.createObjectURL(blob);
        setPreviewBlob(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
      } catch {
        if (requestId !== requestIdRef.current) return;
        setPreviewBlob(null);
        setPreviewError("图片生成失败，请稍后重试");
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    loadPreview();
  }, [open, shareId, title, withQr]);

  async function handleDownload() {
    try {
      const blob =
        previewBlob ||
        (withQr
          ? await generateBilibiliCardBlob({ shareId, title, games, creatorName })
          : await generateStandardShareImageBlob({ games, creatorName }));
      downloadBlob(blob, buildFileName(title, withQr));
    } catch {
      onNotice("info", "下载失败，请长按预览图保存");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>生成分享图片</DialogTitle>
          <DialogDescription>
            可长按预览图保存。开启增强模式后，会追加二维码和提示文案。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            {loading ? (
              <div className="flex h-[46vh] min-h-[300px] items-center justify-center text-sm text-slate-500">
                正在生成图片...
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="分享图片预览"
                className="mx-auto max-h-[46vh] w-auto max-w-full object-contain"
              />
            ) : (
              <div className="flex h-[46vh] min-h-[300px] items-center justify-center text-sm text-rose-500">
                {previewError || "预览图加载失败"}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="pr-3">
              <p className="text-sm font-semibold text-slate-800">附带二维码和提示文案（推荐）</p>
              <p className="text-xs text-slate-500">
                {withQr ? "已开启：底部追加扫码区与文案" : "已关闭：仅保留基础分享图"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={withQr}
              aria-label="附带二维码和提示文案"
              onClick={() => setWithQr((value) => !value)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                withQr ? "bg-sky-600" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                  withQr ? "translate-x-5" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <p className="text-xs text-slate-500">如果下载失败，请直接长按预览图保存。</p>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={loading || Boolean(previewError)}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            保存图片
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

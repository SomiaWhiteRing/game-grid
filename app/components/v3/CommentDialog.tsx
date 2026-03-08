"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  spoiler: boolean;
  onChangeValue: (value: string) => void;
  onChangeSpoiler: (spoiler: boolean) => void;
  onSave: () => void;
}

export function CommentDialog({
  open,
  onOpenChange,
  value,
  spoiler,
  onChangeValue,
  onChangeSpoiler,
  onSave,
}: CommentDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">编辑评论</h2>
            <p className="text-sm text-slate-600">评论最多 140 字，可设置为剧透折叠。</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
            aria-label="关闭评论弹窗"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            value={value}
            maxLength={140}
            onChange={(event) => onChangeValue(event.target.value.slice(0, 140))}
            className="min-h-32 w-full resize-none rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            placeholder="写下你想说的评论..."
            autoFocus
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
                checked={spoiler}
                onChange={(event) => onChangeSpoiler(event.target.checked)}
              />
              剧透折叠
            </label>
            <span>{value.length}/140</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" onClick={onSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

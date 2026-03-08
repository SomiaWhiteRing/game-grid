"use client";

import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

interface InlineToastProps {
  kind: ToastKind;
  message: string;
}

const toneClass: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

export function InlineToast({ kind, message }: InlineToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-2xl border px-4 py-2 text-sm font-medium shadow-sm",
        toneClass[kind]
      )}
    >
      {message}
    </div>
  );
}


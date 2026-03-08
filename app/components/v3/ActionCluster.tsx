"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionClusterProps {
  filledCount: number;
  readOnly: boolean;
  saving: boolean;
  canUndo: boolean;
  canClear: boolean;
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
}

function saveButtonLabel(params: { saving: boolean; filledCount: number }) {
  const { saving, filledCount } = params;
  if (saving) return "保存中...";
  if (filledCount < 9) return `还差 ${9 - filledCount} 个可保存`;
  return "保存页面";
}

export function ActionCluster({
  filledCount,
  readOnly,
  saving,
  canUndo,
  canClear,
  onUndo,
  onClear,
  onSave,
}: ActionClusterProps) {
  const showEditActions = !readOnly;
  const saveDisabled = saving;

  return (
    <section className="flex w-full flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
        <span>{filledCount} / 9 已选择</span>
        {!readOnly && filledCount < 9 ? (
          <span className="text-xs font-bold text-orange-500">还差{9 - filledCount}个</span>
        ) : null}
      </div>

      {showEditActions ? (
        <div className="w-full max-w-[42rem] space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canUndo}
              onClick={onUndo}
            >
              撤销
            </Button>
            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canClear}
              onClick={onClear}
            >
              清空
            </Button>
          </div>
          <Button
            type="button"
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-sky-200 transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-45",
              !saveDisabled &&
                filledCount < 9 &&
                "cursor-not-allowed opacity-45 hover:bg-sky-600"
            )}
            disabled={saveDisabled}
            onClick={onSave}
          >
            {saveButtonLabel({ saving, filledCount })}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

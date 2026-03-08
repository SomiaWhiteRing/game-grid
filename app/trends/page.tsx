"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TrendResponse, TrendPeriod, TrendView } from "@/lib/share/types";

type TrendsApiResponse = TrendResponse & { ok: boolean };

const PERIOD_OPTIONS: Array<{ value: TrendPeriod; label: string }> = [
  { value: "30d", label: "30天" },
  { value: "90d", label: "90天" },
  { value: "180d", label: "180天" },
  { value: "all", label: "全部" },
];

const VIEW_OPTIONS: Array<{ value: TrendView; label: string }> = [
  { value: "overall", label: "综合" },
  { value: "genre", label: "类型" },
  { value: "decade", label: "年代Top5" },
  { value: "year", label: "年份Top5" },
];

function formatDateTime(value: number | null) {
  if (!value) return "暂无";
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

export default function TrendsPage() {
  const [period, setPeriod] = useState<TrendPeriod>("90d");
  const [view, setView] = useState<TrendView>("overall");
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTrends() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/trends?period=${encodeURIComponent(period)}&view=${encodeURIComponent(view)}`,
          { cache: "no-store" }
        );
        const json = (await response.json()) as Partial<TrendsApiResponse> & { error?: string };

        if (!active) return;
        if (!response.ok || !json.ok) {
          setError(json.error || "趋势数据加载失败");
          setData(null);
          return;
        }

        setData({
          period: json.period as TrendPeriod,
          view: json.view as TrendView,
          sampleCount: Number(json.sampleCount || 0),
          range: {
            from: typeof json.range?.from === "number" ? json.range.from : null,
            to: typeof json.range?.to === "number" ? json.range.to : null,
          },
          lastUpdatedAt: Number(json.lastUpdatedAt || Date.now()),
          items: Array.isArray(json.items) ? json.items : [],
        });
      } catch {
        if (!active) return;
        setError("趋势数据加载失败");
        setData(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrends();
    return () => {
      active = false;
    };
  }, [period, view]);

  const hasInsufficientSamples = (data?.sampleCount ?? 0) < 30;

  const topCardSummary = useMemo(() => {
    if (!data) return "目标周期：最近90天";
    const periodText =
      data.period === "all" ? "全周期" : `最近${data.period.replace("d", "")}天`;
    return `目标周期：${periodText}`;
  }, [data]);

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-4 py-12 text-slate-800">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            返回主页面
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">社区聚合</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">大家的 9 本趋势榜 β</h1>
              <p className="text-sm text-slate-600">{topCardSummary}</p>
              <p className="text-xs text-slate-500">
                样本数：{data?.sampleCount ?? "-"} · 集计区间：
                {formatDateTime(data?.range.from ?? null)} ～ {formatDateTime(data?.range.to ?? null)}
              </p>
              <p className="text-xs text-slate-500">最后更新：{formatDateTime(data?.lastUpdatedAt ?? null)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={option.value === period ? "default" : "outline"}
                  className={
                    option.value === period
                      ? "rounded-full border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  }
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">排行榜</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {VIEW_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={option.value === view ? "default" : "outline"}
                  className={
                    option.value === view
                      ? "rounded-full border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  }
                  onClick={() => setView(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              本页只展示真实分享聚合结果，样本不足时显示空榜。
            </p>
          </div>

          {loading ? <p className="text-sm text-slate-600">加载中...</p> : null}
          {!loading && error ? <p className="text-sm text-rose-600">{error}</p> : null}

          {!loading && !error && data && hasInsufficientSamples ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
              当前数据不足，请稍后再看
            </div>
          ) : null}

          {!loading && !error && data && !hasInsufficientSamples ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.items.length === 0 ? (
                <p className="text-sm text-slate-600">暂无排行数据。</p>
              ) : (
                data.items.map((bucket, bucketIndex) => (
                  <article
                    key={bucket.key}
                    className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-sky-500">#{bucketIndex + 1}</span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
                        选中 {bucket.count}
                      </span>
                    </div>

                    {bucket.games[0] ? (
                      <div className="flex items-start gap-2.5">
                        <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
                          {bucket.games[0].cover ? (
                            <img
                              src={bucket.games[0].cover}
                              alt={bucket.games[0].name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                              无图
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {bucket.games[0].localizedName || bucket.games[0].name}
                            {bucket.games[0].releaseYear ? ` (${bucket.games[0].releaseYear})` : ""}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{bucket.label}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">暂无条目</p>
                    )}
                  </article>
                ))
              )}
            </div>
          ) : null}
        </section>

        <footer className="mx-auto w-full max-w-2xl border-t border-slate-500 pt-8 text-center text-xs text-slate-500">
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
    </main>
  );
}

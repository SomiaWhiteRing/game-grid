import { NextResponse } from "next/server";
import { listSharesByPeriod, getTrendsCache, setTrendsCache } from "@/lib/share/storage";
import { buildTrendResponse } from "@/lib/share/trends";
import { TrendPeriod, TrendView } from "@/lib/share/types";

const VALID_PERIODS: TrendPeriod[] = ["30d", "90d", "180d", "all"];
const VALID_VIEWS: TrendView[] = ["overall", "genre", "decade", "year"];

function parsePeriod(value: string | null): TrendPeriod {
  if (value && VALID_PERIODS.includes(value as TrendPeriod)) {
    return value as TrendPeriod;
  }
  return "90d";
}

function parseView(value: string | null): TrendView {
  if (value && VALID_VIEWS.includes(value as TrendView)) {
    return value as TrendView;
  }
  return "overall";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = parsePeriod(searchParams.get("period"));
  const view = parseView(searchParams.get("view"));

  const cached = await getTrendsCache(period, view);
  if (cached) {
    return NextResponse.json({
      ok: true,
      ...cached,
    });
  }

  const shares = await listSharesByPeriod(period);
  const response = buildTrendResponse({
    period,
    view,
    shares,
  });
  const normalizedResponse =
    response.sampleCount < 30
      ? {
          ...response,
          items: [],
        }
      : response;

  await setTrendsCache(period, view, normalizedResponse, 600);

  return NextResponse.json({
    ok: true,
    ...normalizedResponse,
  });
}

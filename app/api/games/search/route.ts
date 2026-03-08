import { NextResponse } from "next/server";
import { buildBangumiSearchResponse, searchBangumiGames } from "@/lib/bangumi/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json(buildBangumiSearchResponse("", []));
  }

  if (query.length < 2) {
    const payload = buildBangumiSearchResponse(query, []);
    return NextResponse.json(
      {
        ...payload,
        ok: false,
        error: "至少输入 2 个字符",
      },
      { status: 400 }
    );
  }

  try {
    const items = await searchBangumiGames(query);
    return NextResponse.json(buildBangumiSearchResponse(query, items));
  } catch (error) {
    const payload = buildBangumiSearchResponse(query, []);
    return NextResponse.json(
      {
        ...payload,
        ok: false,
        error: error instanceof Error ? error.message : "搜索失败",
      },
      { status: 500 }
    );
  }
}

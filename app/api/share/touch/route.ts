import { NextResponse } from "next/server";
import { normalizeShareId } from "@/lib/share/id";
import { touchShare } from "@/lib/share/storage";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const shareId = normalizeShareId(searchParams.get("id"));
  if (!shareId) {
    return NextResponse.json(
      {
        ok: false,
        error: "无效的分享 ID",
      },
      { status: 400 }
    );
  }

  const touched = await touchShare(shareId, Date.now());
  if (!touched) {
    return NextResponse.json(
      {
        ok: false,
        error: "分享不存在",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}


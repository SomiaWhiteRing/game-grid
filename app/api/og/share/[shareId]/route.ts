import { normalizeShareId } from "@/lib/share/id";
import { getShare } from "@/lib/share/storage";
import { createShareImageResponse } from "@/lib/share/shareImage";

export const runtime = "edge";

export async function GET(
  _request: Request,
  context: { params: { shareId: string } }
) {
  const shareId = normalizeShareId(context.params.shareId);
  if (!shareId) {
    return new Response("invalid share id", { status: 400 });
  }

  const share = await getShare(shareId);
  if (!share) {
    return new Response("share not found", { status: 404 });
  }

  return createShareImageResponse({ share });
}


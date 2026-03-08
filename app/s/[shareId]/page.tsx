import { notFound } from "next/navigation";
import GameGridV3App from "@/app/components/GameGridV3App";
import { normalizeShareId } from "@/lib/share/id";

export default function ShareReadonlyPage({
  params,
}: {
  params: { shareId: string };
}) {
  const shareId = normalizeShareId(params.shareId);
  if (!shareId) {
    notFound();
  }

  return <GameGridV3App initialShareId={shareId} readOnlyShare />;
}

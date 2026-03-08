import { ImageResponse } from "next/og";
import { StoredShareV1 } from "@/lib/share/types";

export const SHARE_IMAGE_VERSION = "2026-03-05-1";

function displayName(name?: string | null) {
  if (!name) return "匿名玩家";
  const trimmed = name.trim();
  return trimmed || "匿名玩家";
}

function gameName(game: StoredShareV1["games"][number]) {
  if (!game) return "未选择";
  return game.localizedName?.trim() || game.name;
}

export function createShareImageResponse(params: {
  share: StoredShareV1;
  title?: string;
}) {
  const { share } = params;
  const creator = displayName(share.creatorName);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          background: "#f8fafc",
          color: "#0f172a",
          padding: "36px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontSize: "52px", fontWeight: 800 }}>构成我的9款游戏</div>
          <div style={{ fontSize: "26px", color: "#475569" }}>@{creator}</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
            flex: 1,
          }}
        >
          {share.games.map((game, index) => (
            <div
              key={`${index}`}
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "240px",
                  background: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {game?.cover ? (
                  <img
                    src={game.cover}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "24px", color: "#64748b" }}>图片缺失</div>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    padding: "4px 8px",
                    borderRadius: "9999px",
                    background: "rgba(15, 23, 42, 0.72)",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
              </div>

              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {gameName(game)}
                </div>
                {game?.comment ? (
                  <div style={{ fontSize: "18px", color: "#475569", lineHeight: 1.35 }}>
                    {game.spoiler ? "剧透评论（已折叠）" : game.comment}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "14px",
            fontSize: "22px",
            color: "#64748b",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>GameGrid v3</span>
          <span>share/{share.shareId}</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
}

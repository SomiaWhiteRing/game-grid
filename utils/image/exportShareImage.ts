"use client";

import QRCode from "qrcode";
import { ShareGame } from "@/lib/share/types";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1440;
const ENHANCED_EXTRA_HEIGHT = 220;

const PANEL_MARGIN_X = 42;
const PANEL_MARGIN_Y = 44;
const PANEL_PADDING = 18;
const PANEL_RADIUS = 22;
const SLOT_GAP = 14;

const PANEL_X = PANEL_MARGIN_X;
const PANEL_Y = PANEL_MARGIN_Y;
const PANEL_WIDTH = CANVAS_WIDTH - PANEL_MARGIN_X * 2;
const BASE_PANEL_HEIGHT = CANVAS_HEIGHT - PANEL_MARGIN_Y * 2;

function displayName(game: ShareGame | null): string {
  if (!game) return "未选择";
  return game.localizedName?.trim() || game.name;
}

function displayUserName(creatorName?: string | null): string {
  const value = creatorName?.trim();
  return value || "我";
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = objectUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("图片加载失败"));
  });
  URL.revokeObjectURL(objectUrl);
  return image;
}

async function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("二维码生成失败"));
  });
  return image;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("无法生成图片数据"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const offsetX = x + (width - drawWidth) / 2;
  const offsetY = y + (height - drawHeight) / 2;
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function drawEmptySlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2 - 12;

  ctx.strokeStyle = "#9ca3af";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX - 13, centerY);
  ctx.lineTo(centerX + 13, centerY);
  ctx.moveTo(centerX, centerY - 13);
  ctx.lineTo(centerX, centerY + 13);
  ctx.stroke();

  ctx.fillStyle = "#9ca3af";
  ctx.font = "600 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("选择", centerX, centerY + 45);
}

function trimTextToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }

  let output = text;
  while (output && ctx.measureText(`${output}...`).width > maxWidth) {
    output = output.slice(0, -1);
  }
  return `${output}...`;
}

async function loadCovers(games: Array<ShareGame | null>) {
  const coverPromises = games.map(async (game) => {
    const cover = game?.cover?.trim();
    if (!cover) return null;

    try {
      const response = await fetch(cover, { cache: "force-cache" });
      if (!response.ok) return null;
      return await blobToImage(await response.blob());
    } catch {
      return null;
    }
  });

  return Promise.all(coverPromises);
}

function drawPageBackground(ctx: CanvasRenderingContext2D, height: number) {
  ctx.fillStyle = "#f3f6fb";
  ctx.fillRect(0, 0, CANVAS_WIDTH, height);
}

function drawBoardPanel(ctx: CanvasRenderingContext2D, panelHeight: number) {
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.16)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  roundedRectPath(ctx, PANEL_X, PANEL_Y, PANEL_WIDTH, panelHeight, PANEL_RADIUS);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  roundedRectPath(ctx, PANEL_X, PANEL_Y, PANEL_WIDTH, panelHeight, PANEL_RADIUS);
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  games: Array<ShareGame | null>,
  covers: Array<HTMLImageElement | null>
) {
  const innerWidth = PANEL_WIDTH - PANEL_PADDING * 2;
  const gridHeight = BASE_PANEL_HEIGHT - PANEL_PADDING * 2;

  const slotWidth = Math.floor((innerWidth - SLOT_GAP * 2) / 3);
  const slotHeight = Math.floor((gridHeight - SLOT_GAP * 2) / 3);

  for (let index = 0; index < 9; index += 1) {
    const col = index % 3;
    const row = Math.floor(index / 3);

    const x = PANEL_X + PANEL_PADDING + col * (slotWidth + SLOT_GAP);
    const y = PANEL_Y + PANEL_PADDING + row * (slotHeight + SLOT_GAP);

    ctx.save();
    roundedRectPath(ctx, x, y, slotWidth, slotHeight, 14);
    ctx.fillStyle = "#f9fafb";
    ctx.fill();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    roundedRectPath(ctx, x, y, slotWidth, slotHeight, 14);
    ctx.clip();
    const cover = covers[index];
    if (cover) {
      drawCoverFit(ctx, cover, x, y, slotWidth, slotHeight);
    } else {
      drawEmptySlot(ctx, x, y, slotWidth, slotHeight);
    }
    ctx.restore();

    ctx.fillStyle = "#d1d5db";
    ctx.font = "700 19px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(String(index + 1), x + 12, y + 24);

    const game = games[index] || null;
    if (game && !cover) {
      ctx.fillStyle = "#6b7280";
      ctx.font = "600 18px sans-serif";
      ctx.textAlign = "center";
      const name = trimTextToWidth(ctx, displayName(game), slotWidth - 16);
      ctx.fillText(name, x + slotWidth / 2, y + slotHeight - 16);
    }
  }
}

async function createBoardCanvas(options: {
  games: Array<ShareGame | null>;
  totalHeight: number;
  panelHeight: number;
}) {
  const { games, totalHeight, panelHeight } = options;
  const covers = await loadCovers(games);

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = totalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("无法创建导出画布");
  }

  drawPageBackground(ctx, totalHeight);
  drawBoardPanel(ctx, panelHeight);
  drawGrid(ctx, games, covers);

  return canvas;
}

export async function generateStandardShareImageBlob(options: {
  games: Array<ShareGame | null>;
  creatorName?: string | null;
}) {
  const canvas = await createBoardCanvas({
    games: options.games,
    totalHeight: CANVAS_HEIGHT,
    panelHeight: BASE_PANEL_HEIGHT,
  });
  return canvasToBlob(canvas);
}

export async function generateBilibiliCardBlob(options: {
  shareId: string;
  title: string;
  games: Array<ShareGame | null>;
  creatorName?: string | null;
  origin?: string;
}) {
  const origin = options.origin ?? window.location.origin;
  const shareUrl = `${origin}/s/${options.shareId}`;

  const canvas = await createBoardCanvas({
    games: options.games,
    totalHeight: CANVAS_HEIGHT + ENHANCED_EXTRA_HEIGHT,
    panelHeight: BASE_PANEL_HEIGHT + ENHANCED_EXTRA_HEIGHT,
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("无法创建导出画布");
  }

  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    width: 180,
    margin: 1,
  });
  const qrImage = await dataUrlToImage(qrDataUrl);

  const userName = displayUserName(options.creatorName);
  const reviewCount = options.games.filter(
    (game) => Boolean(game?.comment && game.comment.trim().length > 0)
  ).length;

  const line1 = `构成${userName}的9款游戏`;
  const line2 =
    reviewCount > 0
      ? `扫码查看${userName}的${reviewCount}条评价`
      : "扫码查看游戏详情";

  const extY = PANEL_Y + BASE_PANEL_HEIGHT;
  const extHeight = ENHANCED_EXTRA_HEIGHT;

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PANEL_X + 22, extY + 2);
  ctx.lineTo(PANEL_X + PANEL_WIDTH - 22, extY + 2);
  ctx.stroke();

  const qrSize = 150;
  const qrX = PANEL_X + PANEL_WIDTH - qrSize - 26;
  const qrY = extY + Math.round((extHeight - qrSize) / 2);
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  const textX = PANEL_X + 26;
  const textMaxWidth = qrX - textX - 20;

  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 38px sans-serif";
  ctx.fillText(trimTextToWidth(ctx, line1, textMaxWidth), textX, extY + 86);

  ctx.fillStyle = "#334155";
  ctx.font = "600 30px sans-serif";
  ctx.fillText(trimTextToWidth(ctx, line2, textMaxWidth), textX, extY + 142);

  (window as typeof window & { __GAMEGRID_LAST_BILI_EXPORT__?: unknown })
    .__GAMEGRID_LAST_BILI_EXPORT__ = {
    width: canvas.width,
    height: canvas.height,
    shareUrl,
  };

  return canvasToBlob(canvas);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("download", filename);
  link.setAttribute("href", url);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportBilibiliCard(options: {
  shareId: string;
  title: string;
  games: Array<ShareGame | null>;
  creatorName?: string | null;
  origin?: string;
}) {
  const blob = await generateBilibiliCardBlob(options);
  const fileName = `${options.title || "构成我的9款游戏"}-B站分享图.png`;
  downloadBlob(blob, fileName);
}

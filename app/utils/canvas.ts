import { DrawCommand, CanvasConfig } from "../types";

/**
 * 生成游戏手柄图标路径
 */
export const gamepadIconPath = (x: number, y: number, size: number): DrawCommand[] => {
  // 缩放因子，使图标适应给定的尺寸
  const scale = size / 24;
  const translateX = x;
  const translateY = y;

  return [
    // 横线1 (左侧十字键横线)
    { cmd: "beginPath" },
    { cmd: "moveTo", args: [translateX + 6 * scale, translateY + 11 * scale] },
    { cmd: "lineTo", args: [translateX + 10 * scale, translateY + 11 * scale] },
    { cmd: "stroke" },

    // 竖线1 (左侧十字键竖线)
    { cmd: "beginPath" },
    { cmd: "moveTo", args: [translateX + 8 * scale, translateY + 9 * scale] },
    { cmd: "lineTo", args: [translateX + 8 * scale, translateY + 13 * scale] },
    { cmd: "stroke" },

    // 右侧按钮1 - 改为圆形
    { cmd: "beginPath" },
    { cmd: "arc", args: [translateX + 15 * scale, translateY + 12 * scale, 1 * scale, 0, Math.PI * 2] },
    { cmd: "fill" },

    // 右侧按钮2 - 改为圆形
    { cmd: "beginPath" },
    { cmd: "arc", args: [translateX + 18 * scale, translateY + 10 * scale, 1 * scale, 0, Math.PI * 2] },
    { cmd: "fill" },

    // 手柄主体路径
    { cmd: "beginPath" },
    { cmd: "moveTo", args: [translateX + 17.32 * scale, translateY + 5 * scale] },
    { cmd: "lineTo", args: [translateX + 6.68 * scale, translateY + 5 * scale] },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 4.55 * scale, translateY + 5 * scale,
        translateX + 2.77 * scale, translateY + 6.45 * scale,
        translateX + 2.702 * scale, translateY + 8.59 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 2.696 * scale, translateY + 8.642 * scale,
        translateX + 2.692 * scale, translateY + 8.691 * scale,
        translateX + 2.685 * scale, translateY + 8.742 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 2.604 * scale, translateY + 9.416 * scale,
        translateX + 2 * scale, translateY + 14.456 * scale,
        translateX + 2 * scale, translateY + 16 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 2 * scale, translateY + 17.657 * scale,
        translateX + 3.343 * scale, translateY + 19 * scale,
        translateX + 5 * scale, translateY + 19 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 6 * scale, translateY + 19 * scale,
        translateX + 6.5 * scale, translateY + 18.5 * scale,
        translateX + 7 * scale, translateY + 18 * scale
      ]
    },
    { cmd: "lineTo", args: [translateX + 8.414 * scale, translateY + 16.586 * scale] },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 8.78 * scale, translateY + 16.211 * scale,
        translateX + 9.293 * scale, translateY + 16 * scale,
        translateX + 9.828 * scale, translateY + 16 * scale
      ]
    },
    { cmd: "lineTo", args: [translateX + 14.172 * scale, translateY + 16 * scale] },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 14.707 * scale, translateY + 16 * scale,
        translateX + 15.22 * scale, translateY + 16.211 * scale,
        translateX + 15.586 * scale, translateY + 16.586 * scale
      ]
    },
    { cmd: "lineTo", args: [translateX + 17 * scale, translateY + 18 * scale] },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 17.5 * scale, translateY + 18.5 * scale,
        translateX + 18 * scale, translateY + 19 * scale,
        translateX + 19 * scale, translateY + 19 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 20.657 * scale, translateY + 19 * scale,
        translateX + 22 * scale, translateY + 17.657 * scale,
        translateX + 22 * scale, translateY + 16 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 22 * scale, translateY + 14.455 * scale,
        translateX + 21.396 * scale, translateY + 9.416 * scale,
        translateX + 21.315 * scale, translateY + 8.742 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 21.308 * scale, translateY + 8.692 * scale,
        translateX + 21.304 * scale, translateY + 8.642 * scale,
        translateX + 21.298 * scale, translateY + 8.591 * scale
      ]
    },
    {
      cmd: "bezierCurveTo", args: [
        translateX + 21.23 * scale, translateY + 6.45 * scale,
        translateX + 19.45 * scale, translateY + 5 * scale,
        translateX + 17.32 * scale, translateY + 5 * scale
      ]
    },
    { cmd: "closePath" },
    { cmd: "stroke" }
  ];
};

/**
 * 获取点击的单元格ID
 */
export function getCellIdFromCoordinates(
  x: number,
  y: number,
  config: Pick<CanvasConfig, "padding" | "titleHeight" | "width" | "height" | "gridRows" | "gridCols">
): number | null {
  // 计算网格区域
  const gridTop = config.padding + config.titleHeight;
  const gridWidth = config.width - config.padding * 2;
  const gridHeight = config.height - gridTop - config.padding;

  // 计算单元格尺寸
  const cellWidth = gridWidth / config.gridCols;
  const cellHeight = gridHeight / config.gridRows;

  // 检查点击的是哪个单元格
  if (
    x >= config.padding &&
    x <= config.width - config.padding &&
    y >= gridTop &&
    y <= gridTop + gridHeight
  ) {
    const col = Math.floor((x - config.padding) / cellWidth);
    const row = Math.floor((y - gridTop) / cellHeight);

    if (col >= 0 && col < config.gridCols && row >= 0 && row < config.gridRows) {
      return row * config.gridCols + col;
    }
  }

  return null;
}

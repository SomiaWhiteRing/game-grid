"use client"

import { useState, useEffect, RefObject } from "react"
import { GameCell, GlobalConfig } from "../types"
import { CANVAS_CONFIG, isBrowser } from "../constants"
import { gamepadIconPath } from "../utils/canvas"
import { toProxiedBangumiImageUrl } from "../utils/imageProxy"
import { getGridLayout } from "../utils/gridLayout"

interface UseCanvasRendererProps {
  canvasRef: RefObject<HTMLCanvasElement>
  cells: GameCell[]
  setCells: React.Dispatch<React.SetStateAction<GameCell[]>>
  dragOverCellId: number | null
  globalConfig: GlobalConfig
}

export function useCanvasRenderer({
  canvasRef,
  cells,
  setCells,
  dragOverCellId,
  globalConfig,
}: UseCanvasRendererProps) {
  const [scale, setScale] = useState(1)
  const [canvasLoaded, setCanvasLoaded] = useState(false)

  // 绘制Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const layout = getGridLayout(globalConfig.gridCols, cells.length)

    try {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制白色背景
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制标题（自适应缩放过长文本）
      ctx.fillStyle = "black"
      const baseFontSize = CANVAS_CONFIG.titleFontSize
      ctx.font = `bold ${baseFontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const title = globalConfig.mainTitle || ""
      const maxWidth = canvas.width - CANVAS_CONFIG.padding * 2
      const metrics = ctx.measureText(title)
      let fontSize = baseFontSize
      if (metrics.width > maxWidth && metrics.width > 0) {
        const scale = maxWidth / metrics.width
        fontSize = Math.max(12, Math.floor(baseFontSize * scale))
        ctx.font = `bold ${fontSize}px sans-serif`
      }

      const titleY = CANVAS_CONFIG.padding + CANVAS_CONFIG.titleHeight / 2
      ctx.fillText(title, canvas.width / 2, titleY)

      // 计算网格区域
      const { gridTop, cellWidth, cellHeight, coverWidth, coverHeight } = layout

      // 绘制单元格
      cells.forEach((cell, index) => {
        const row = Math.floor(index / layout.gridCols)
        const col = index % layout.gridCols

        const x = CANVAS_CONFIG.padding + col * cellWidth
        const y = gridTop + row * cellHeight

        // 绘制单元格边框
        ctx.strokeStyle = "black"
        ctx.lineWidth = CANVAS_CONFIG.cellBorderWidth

        // 如果是拖拽目标，绘制高亮边框
        if (dragOverCellId === cell.id) {
          ctx.strokeStyle = "#3b82f6" // 蓝色高亮
          ctx.lineWidth = CANVAS_CONFIG.cellBorderWidth * 2
        }

        // 检查是否支持 roundRect API
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(
            x + CANVAS_CONFIG.cellPadding / 2,
            y + CANVAS_CONFIG.cellPadding / 2,
            cellWidth - CANVAS_CONFIG.cellPadding,
            cellHeight - CANVAS_CONFIG.cellPadding,
            CANVAS_CONFIG.cellBorderRadius
          );
          ctx.stroke();
        } else {
          // 对于不支持 roundRect 的浏览器，使用普通矩形
          ctx.strokeRect(
            x + CANVAS_CONFIG.cellPadding / 2,
            y + CANVAS_CONFIG.cellPadding / 2,
            cellWidth - CANVAS_CONFIG.cellPadding,
            cellHeight - CANVAS_CONFIG.cellPadding
          );
        }

        // 计算封面区域
        const coverX = x + CANVAS_CONFIG.cellPadding + CANVAS_CONFIG.cellBorderWidth
        const coverY = y + CANVAS_CONFIG.cellPadding + CANVAS_CONFIG.cellBorderWidth

        // 绘制封面区域
        if (cell.imageObj) {
          try {
            // 绘制游戏封面
            ctx.drawImage(cell.imageObj, coverX, coverY, coverWidth, coverHeight);
          } catch (error) {
            console.error(`绘制图片失败: ${cell.name || index}`, error);
            // 绘制错误占位图
            drawPlaceholder(ctx, coverX, coverY, coverWidth, coverHeight);
          }
        } else {
          // 绘制空白封面区域
          drawPlaceholder(ctx, coverX, coverY, coverWidth, coverHeight);
        }

        // 绘制标题文字（自适应缩放 + 垂直居中）
        ctx.fillStyle = "black"
        const baseCellTitleFont = CANVAS_CONFIG.cellTitleFontSize
        ctx.font = `${baseCellTitleFont}px sans-serif`
        ctx.textAlign = "center"
        // 允许的最大宽度（左右各留出 padding）
        const cellTitleMaxWidth = cellWidth - CANVAS_CONFIG.cellPadding * 2
        const cellTitleMetrics = ctx.measureText(cell.title)
        let cellTitleFontSize = baseCellTitleFont
        if (cellTitleMetrics.width > cellTitleMaxWidth && cellTitleMetrics.width > 0) {
          const scale = cellTitleMaxWidth / cellTitleMetrics.width
          cellTitleFontSize = Math.max(10, Math.floor(baseCellTitleFont * scale))
          ctx.font = `${cellTitleFontSize}px sans-serif`
        }
        // 以固定高度区域居中，确保不同字号的标题基线一致
        const titleTop = coverY + CANVAS_CONFIG.cellTitleMargin + coverHeight
        // 使用固定槽位高度（基础字号），保证过长缩小时也垂直居中
        const titleAreaHeight = baseCellTitleFont
        const titleCenterY = titleTop + titleAreaHeight / 2
        const prevBaseline = ctx.textBaseline
        ctx.textBaseline = "middle"
        ctx.fillText(
          cell.title,
          x + cellWidth / 2,
          titleCenterY + 3,
        )
        ctx.textBaseline = prevBaseline

        const textMaxWidth = cellWidth - CANVAS_CONFIG.cellPadding * 4
        const nameY =
          coverY +
          coverHeight +
          CANVAS_CONFIG.cellTitleMargin +
          baseCellTitleFont +
          CANVAS_CONFIG.cellNameMargin +
          CANVAS_CONFIG.cellNameFontSize

        drawTruncatedText(
          ctx,
          cell.name,
          x + cellWidth / 2,
          nameY,
          textMaxWidth,
          CANVAS_CONFIG.cellNameFontSize,
          "#4b5563"
        )

        const descriptionY = nameY + CANVAS_CONFIG.cellDescriptionMargin + CANVAS_CONFIG.cellDescriptionFontSize
        drawTruncatedText(
          ctx,
          cell.description,
          x + cellWidth / 2,
          descriptionY,
          textMaxWidth,
          CANVAS_CONFIG.cellDescriptionFontSize,
          "#6b7280"
        )
      })

      // 添加水印
      ctx.fillStyle = "#9ca3af" // 使用灰色
      ctx.font = "28px sans-serif" 
      ctx.textAlign = "right"
      ctx.fillText(
        "gamegrid.shatranj.space",
        canvas.width - CANVAS_CONFIG.padding,
        canvas.height - CANVAS_CONFIG.padding / 2
      )
    } catch (error) {
      console.error("绘制Canvas时发生错误:", error)
    }
  }

  // 计算Canvas缩放比例
  useEffect(() => {
    if (!isBrowser || !canvasRef.current) return;

    const updateScale = () => {
      if (!canvasRef.current) return;

      const layout = getGridLayout(globalConfig.gridCols, cells.length);
      const containerWidth = Math.min(window.innerWidth, 1200);
      const newScale = containerWidth / layout.width;
      setScale(newScale);

      // 更新Canvas尺寸
      const canvas = canvasRef.current;
      
      // 保持Canvas的实际像素数
      canvas.width = layout.width;
      canvas.height = layout.height;
      
      // 设置显示尺寸
      canvas.style.width = `${layout.width * newScale}px`;
      canvas.style.height = `${layout.height * newScale}px`;
      setCanvasLoaded(true);

      // 使用 requestAnimationFrame 确保在下一帧重绘
      requestAnimationFrame(() => {
        drawCanvas();
      });
    };

    // 初始更新
    updateScale();
    
    // 使用防抖处理窗口大小变化
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateScale, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [cells.length, globalConfig.gridCols]);

  // 当cells变化时重新绘制Canvas
  useEffect(() => {
    if (canvasLoaded && isBrowser) {
      requestAnimationFrame(() => {
        drawCanvas();
      });
    }
  }, [cells, canvasLoaded, dragOverCellId, globalConfig]);

  // 加载图片
  useEffect(() => {
    if (!isBrowser) return;

    cells.forEach((cell, index) => {
      if (cell.image && !cell.imageObj) {
        try {
          const imageSrc = toProxiedBangumiImageUrl(cell.image);
          if (!imageSrc) return;

          // 使用全局 window.Image 构造函数而不是直接使用 Image
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onerror = (err) => {
            console.error(`图片加载失败: ${imageSrc}`, err);
          };
          img.onload = () => {
            setCells((prev) => {
              const newCells = [...prev];
              newCells[index] = { ...newCells[index], imageObj: img };
              return newCells;
            });
          };
          img.src = imageSrc;
        } catch (error) {
          console.error("创建图片对象失败:", error);
        }
      }
    });
  }, [cells, setCells]);

  // 内部函数：绘制占位符
  function drawPlaceholder(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    ctx.fillStyle = "#f3f4f6"; // 淡灰色背景
    ctx.fillRect(x, y, width, height);

    // 绘制游戏手柄图标
    const iconSize = Math.min(width, height) * 0.4;
    const iconX = x + (width - iconSize) / 2;
    const iconY = y + (height - iconSize) / 2;

    // 绘制游戏手柄图标
    ctx.fillStyle = "#9ca3af";
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 6; 
    gamepadIconPath(iconX, iconY, iconSize).forEach((cmd) => {
      if (cmd.cmd === "beginPath") {
        ctx.beginPath();
      } else if (cmd.cmd === "roundRect" && cmd.args && typeof ctx.roundRect === 'function') {
        ctx.roundRect(
          cmd.args[0] as number,
          cmd.args[1] as number,
          cmd.args[2] as number,
          cmd.args[3] as number,
          cmd.args[4] as number
        );
      } else if (cmd.cmd === "arc" && cmd.args) {
        ctx.arc(
          cmd.args[0] as number,
          cmd.args[1] as number,
          cmd.args[2] as number,
          cmd.args[3] as number,
          cmd.args[4] as number
        );
      } else if (cmd.cmd === "moveTo" && cmd.args) {
        ctx.moveTo(
          cmd.args[0] as number,
          cmd.args[1] as number
        );
      } else if (cmd.cmd === "lineTo" && cmd.args) {
        ctx.lineTo(
          cmd.args[0] as number,
          cmd.args[1] as number
        );
      } else if (cmd.cmd === "bezierCurveTo" && cmd.args) {
        ctx.bezierCurveTo(
          cmd.args[0] as number,
          cmd.args[1] as number,
          cmd.args[2] as number,
          cmd.args[3] as number,
          cmd.args[4] as number,
          cmd.args[5] as number
        );
      } else if (cmd.cmd === "closePath") {
        ctx.closePath();
      } else if (cmd.cmd === "fill") {
        ctx.fill();
      } else if (cmd.cmd === "stroke") {
        ctx.stroke();
      }
    });
  }

  function drawTruncatedText(
    ctx: CanvasRenderingContext2D,
    value: string | undefined,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number,
    color: string
  ) {
    if (!value) return;

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    const previousBaseline = ctx.textBaseline;
    ctx.textBaseline = "alphabetic";

    let text = value;
    while (ctx.measureText(text).width > maxWidth && text.length > 0) {
      text = text.slice(0, -1);
    }
    if (text !== value) text = `${text}...`;
    ctx.fillText(text, x, y);
    ctx.textBaseline = previousBaseline;
  }

  return {
    scale,
    canvasLoaded,
    drawCanvas
  }
}

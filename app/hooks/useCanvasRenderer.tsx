"use client"

import { useState, useEffect, RefObject } from "react"
import { GameCell, GlobalConfig } from "../types"
import { CANVAS_CONFIG, isBrowser } from "../constants"
import { gamepadIconPath } from "../utils/canvas"

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

    try {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制白色背景
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制标题
      ctx.fillStyle = "black"
      ctx.font = `bold ${CANVAS_CONFIG.titleFontSize}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(globalConfig.mainTitle, canvas.width / 2, CANVAS_CONFIG.padding + CANVAS_CONFIG.titleFontSize / 2)

      // 计算网格区域
      const gridTop = CANVAS_CONFIG.padding + CANVAS_CONFIG.titleHeight
      const gridWidth = canvas.width - CANVAS_CONFIG.padding * 2
      const gridHeight = canvas.height - gridTop - CANVAS_CONFIG.padding

      // 计算单元格尺寸
      const cellWidth = gridWidth / CANVAS_CONFIG.gridCols
      const cellHeight = gridHeight / CANVAS_CONFIG.gridRows

      // 绘制单元格
      cells.forEach((cell, index) => {
        const row = Math.floor(index / CANVAS_CONFIG.gridCols)
        const col = index % CANVAS_CONFIG.gridCols

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
        const coverWidth = cellWidth - CANVAS_CONFIG.cellPadding * 2 - CANVAS_CONFIG.cellBorderWidth * 2
        const coverHeight = coverWidth / CANVAS_CONFIG.coverRatio
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

        // 绘制标题文字
        ctx.fillStyle = "black"
        ctx.font = `${CANVAS_CONFIG.cellTitleFontSize}px sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(
          cell.title,
          x + cellWidth / 2,
          coverY + coverHeight + CANVAS_CONFIG.cellTitleMargin + CANVAS_CONFIG.cellTitleFontSize,
        )

        // 如果有游戏名称，绘制游戏名称
        if (cell.name) {
          ctx.fillStyle = "#4b5563" // 灰色文字
          ctx.font = `${CANVAS_CONFIG.cellNameFontSize}px sans-serif`

          // 截断过长的游戏名称
          let gameName = cell.name
          let textWidth = ctx.measureText(gameName).width
          const maxWidth = cellWidth - CANVAS_CONFIG.cellPadding * 4

          if (textWidth > maxWidth) {
            // 截断文本并添加省略号
            let truncated = gameName
            while (textWidth > maxWidth && truncated.length > 0) {
              truncated = truncated.slice(0, -1)
              textWidth = ctx.measureText(truncated + "...").width
            }
            gameName = truncated + "..."
          }

          ctx.fillText(
            gameName,
            x + cellWidth / 2,
            coverY +
              coverHeight +
              CANVAS_CONFIG.cellTitleMargin +
              CANVAS_CONFIG.cellTitleFontSize +
              CANVAS_CONFIG.cellNameMargin +
              CANVAS_CONFIG.cellNameFontSize,
          )
        }
      })

      // 添加水印
      ctx.fillStyle = "#9ca3af" // 使用灰色
      ctx.font = "14px sans-serif"
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

      const containerWidth = Math.min(window.innerWidth, 1200);
      const newScale = containerWidth / CANVAS_CONFIG.width;
      setScale(newScale);

      // 更新Canvas尺寸
      const canvas = canvasRef.current;
      
      // 保持Canvas的实际像素数
      canvas.width = CANVAS_CONFIG.width;
      canvas.height = CANVAS_CONFIG.height;
      
      // 设置显示尺寸
      canvas.style.width = `${CANVAS_CONFIG.width * newScale}px`;
      canvas.style.height = `${CANVAS_CONFIG.height * newScale}px`;

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
  }, [drawCanvas]);

  // 当cells变化时重新绘制Canvas
  useEffect(() => {
    if (canvasLoaded && isBrowser) {
      requestAnimationFrame(() => {
        drawCanvas();
      });
    }
  }, [cells, canvasLoaded, dragOverCellId]);

  // 加载图片
  useEffect(() => {
    if (!isBrowser) return;

    cells.forEach((cell, index) => {
      if (cell.image && !cell.imageObj) {
        try {
          // 使用全局 window.Image 构造函数而不是直接使用 Image
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onerror = (err) => {
            console.error(`图片加载失败: ${cell.image}`, err);
          };
          img.onload = () => {
            setCells((prev) => {
              const newCells = [...prev];
              newCells[index] = { ...newCells[index], imageObj: img };
              return newCells;
            });
          };
          img.src = cell.image;
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
    ctx.lineWidth = 3;
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

  return {
    scale,
    canvasLoaded,
    drawCanvas
  }
}

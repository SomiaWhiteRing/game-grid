"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { GameCell } from "../types";
import { CANVAS_CONFIG } from "../constants";
import { getCellIdFromCoordinates } from "../utils/canvas";
import { saveToIndexedDB } from "../utils/indexedDB";
import { getClickArea, cropImageToAspectRatio, hasContent, getCellSlot } from "@/app/utils/canvasHelpers";

interface UseCanvasEventsProps {
  cells: GameCell[]
  setCells: React.Dispatch<React.SetStateAction<GameCell[]>>
  scale: number
  openSearchDialog: (cellId: number) => void
  openTitleEditDialog: (cellId: number) => void
  openNameEditDialog: (cellId: number) => void
  openMainTitleEditDialog: () => void
  onImageDrop?: (cellId: number, file: File) => void // 添加拖拽图片的回调
  forceCanvasRedraw?: () => void // 添加强制Canvas重绘的函数
}

function trackCellEditForDrag(prevCell: GameCell, nextCell: GameCell) {
  const prevHas = hasContent(prevCell);
  const nextHas = hasContent(nextCell);

  let editType: "set" | "change" | "clear" | null = null;
  if (!prevHas && nextHas) editType = "set";
  else if (prevHas && nextHas) editType = "change";
  else if (prevHas && !nextHas) editType = "clear";

  if (!editType) return;

  const cellSlot = getCellSlot(nextCell.id);

  const gameName = nextCell.name
    ? nextCell.name.slice(0, 80)
    : nextCell.image
      ? "__image_only__"
      : "";

  trackEvent("grid_cell_edit", {
    grid_locale: "unknown",
    grid_version: "v2",
    cell_slot: cellSlot,
    edit_type: editType,
    cell_title_kind: "unknown",
    cell_label: cellSlot,
    game_name: gameName,
  });
}

export function useCanvasEvents({
  cells,
  setCells,
  scale,
  openSearchDialog,
  openTitleEditDialog,
  openNameEditDialog,
  openMainTitleEditDialog,
  onImageDrop,
  forceCanvasRedraw,
}: UseCanvasEventsProps) {
  const [dragOverCellId, setDragOverCellId] = useState<number | null>(null)

  // 处理Canvas点击事件
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    if (!canvas) return;

    // 获取点击坐标（考虑缩放）
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // 检查是否点击了主标题区域
    if (y < CANVAS_CONFIG.padding + CANVAS_CONFIG.titleHeight) {
      openMainTitleEditDialog();
      return;
    }

    // 检查点击的是哪个单元格
    const cellId = getCellIdFromCoordinates(x, y, CANVAS_CONFIG);
    if (cellId !== null) {
      // 检查点击的具体区域
      const clickArea = getClickArea(x, y, cellId, CANVAS_CONFIG);
      console.log(cellId, clickArea);
      
      // 根据点击区域执行不同操作
      if (clickArea === "image") {
        // 点击图片区域，打开搜索对话框
        openSearchDialog(cellId);
      } else if (clickArea === "title") {
        // 点击标题区域，编辑标题
        openTitleEditDialog(cellId);
      } else if (clickArea === "name") {
        // 点击游戏名称区域，编辑游戏名称
        openNameEditDialog(cellId);
      }
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    // 获取拖拽坐标（考虑缩放）
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    // 获取拖拽经过的单元格
    const cellId = getCellIdFromCoordinates(x, y, CANVAS_CONFIG)

    // 更新拖拽经过的单元格ID
    setDragOverCellId(cellId)
    
    // 强制重绘Canvas
    if (forceCanvasRedraw) {
      forceCanvasRedraw();
    }
  }

  const handleDragLeave = () => {
    setDragOverCellId(null)
    
    // 强制重绘Canvas
    if (forceCanvasRedraw) {
      forceCanvasRedraw();
    }
  }

  // 确保图片加载完成后重绘Canvas
  const ensureImageLoaded = (imageUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.src = imageUrl;
    });
  };

  const handleDrop = async (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    // 获取拖拽坐标（考虑缩放）
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    // 获取拖拽放置的单元格
    const cellId = getCellIdFromCoordinates(x, y, CANVAS_CONFIG)

    // 清除拖拽状态
    setDragOverCellId(null)
    
    // 强制重绘Canvas
    if (forceCanvasRedraw) {
      forceCanvasRedraw();
    }

    if (cellId === null) return

    // 处理拖拽的文件
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]

      // 检查是否是图片文件
      if (!file.type.startsWith("image/")) {
        console.error("只能拖拽图片文件");
        alert("只能拖拽图片文件");
        return
      }

      // 如果提供了 onImageDrop 回调，使用它来处理（会打开裁剪对话框）
      if (onImageDrop) {
        onImageDrop(cellId, file);
        return;
      }

      // 否则使用默认的自动裁剪处理（向后兼容）
      // 限制图片大小为3MB
      const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
      if (file.size > MAX_FILE_SIZE) {
        console.error("图片文件过大");
        alert("图片文件过大,请上传小于3MB的图片");
        return
      }

      try {
        // 读取图片文件
        const originalImageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        
        // 裁剪图片为3:4的长宽比
        const croppedImageUrl = await cropImageToAspectRatio(originalImageUrl);
        
        // 确保图片已完全加载
        await ensureImageLoaded(croppedImageUrl);

        // 生成唯一标识，确保React检测到图片URL的变化
        // 这里我们添加一个时间戳参数，确保即使是相同的图片也会被认为是新的URL
        const uniqueImageUrl = `${croppedImageUrl}#t=${Date.now()}`;

        const prevCell = cells[cellId];

        // 更新单元格数据
        const updatedCell: GameCell = {
          ...prevCell,
          image: uniqueImageUrl,
          name: file.name.replace(/\.[^/.]+$/, ""), // 移除文件扩展名作为游戏名称
          imageObj: null, // 明确清除旧的图片对象
        }

        // 更新状态
        setCells((prev) => {
          const newCells = [...prev]
          newCells[cellId] = updatedCell
          return newCells
        })

        trackCellEditForDrag(prevCell, updatedCell);

        // 保存到IndexedDB
        await saveToIndexedDB(updatedCell)

        console.log("图片已添加到格子中");
      } catch (error) {
        console.error("读取或处理图片失败:", error)
      }
    }
  }

  // 计算base64数据的文件大小（字节）
  const getBase64Size = (base64String: string): number => {
    // 移除data URL前缀
    const base64Data = base64String.split(',')[1] || base64String;
    // base64编码后的大小约为原始大小的4/3
    const padding = (base64Data.match(/=/g) || []).length;
    return (base64Data.length * 3) / 4 - padding;
  }

  // 生成图片
  const generateImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      let dataUrl = "";
      let fileName = "";
      let fileSize = 0;

      // 获取主标题（从localStorage）
      let baseFileName = "游戏生涯个人喜好表";
      try {
        const savedConfig = localStorage.getItem('gameGridGlobalConfig');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          if (parsedConfig.mainTitle) {
            baseFileName = parsedConfig.mainTitle;
          }
        }
      } catch (error) {
        console.error("获取主标题失败:", error);
      }

      // 尝试不同的质量和格式，确保文件大小在5MB以内
      // 首先尝试高质量JPEG（质量0.95）
      dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      fileSize = getBase64Size(dataUrl);
      console.log(`尝试JPEG质量0.95: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

      if (fileSize <= maxFileSize) {
        fileName = `${baseFileName}.jpg`;
      } else {
        // 如果太大，尝试质量0.9
        dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        fileSize = getBase64Size(dataUrl);
        console.log(`尝试JPEG质量0.9: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

        if (fileSize <= maxFileSize) {
          fileName = `${baseFileName}.jpg`;
        } else {
          // 如果还是太大，尝试质量0.85
          dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          fileSize = getBase64Size(dataUrl);
          console.log(`尝试JPEG质量0.85: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

          if (fileSize <= maxFileSize) {
            fileName = `${baseFileName}.jpg`;
          } else {
            // 如果还是太大，尝试质量0.8
            dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            fileSize = getBase64Size(dataUrl);
            console.log(`尝试JPEG质量0.8: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

            if (fileSize <= maxFileSize) {
              fileName = `${baseFileName}.jpg`;
            } else {
              // 最后尝试质量0.75
              dataUrl = canvas.toDataURL("image/jpeg", 0.75);
              fileSize = getBase64Size(dataUrl);
              console.log(`尝试JPEG质量0.75: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
              fileName = `${baseFileName}.jpg`;
              
              if (fileSize > maxFileSize) {
                console.warn(`警告：图片大小 ${(fileSize / 1024 / 1024).toFixed(2)}MB 超过了5MB限制`);
              }
            }
          }
        }
      }

      // 创建下载链接
      const link = document.createElement("a")
      link.download = fileName
      link.href = dataUrl
      link.click()

      console.log(`图片已生成并下载: ${fileName}, 大小: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      console.error("生成图片失败:", error)
    }
  }

  return {
    dragOverCellId,
    handleCanvasClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    generateImage,
  }
}

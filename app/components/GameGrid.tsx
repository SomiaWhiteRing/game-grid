"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { trackEvent } from "@/lib/analytics";
import { GameCell, GameSearchResult, GlobalConfig } from "../types";
import { saveToIndexedDB } from "../utils/indexedDB";
import { GameSearchDialog } from "./GameSearchDialog";
import { TextEditDialog } from "./TextEditDialog";
import { ImageCropDialog } from "./ImageCropDialog";
import { useCanvasRenderer } from "../hooks/useCanvasRenderer";
import { useCanvasEvents } from "../hooks/useCanvasEvents";
import { CANVAS_CONFIG } from "../constants";
import { hasContent, getCellSlot } from "../utils/canvasHelpers";

interface GameGridProps {
  initialCells: GameCell[];
  onUpdateCells: (cells: GameCell[]) => void;
}

function buildSignature(locale: string, mainTitle: string, cells: GameCell[]) {
  const parts = cells.map((cell) => {
    const hasImage = cell.image ? "1" : "0";
    const name = cell.name || "";
    return `${cell.id}:${cell.title}|${name}|${hasImage}`;
  });
  return `${locale}|${mainTitle}|${parts.join(";")}`;
}

function trackCellEditEvent(
  prevCell: GameCell,
  nextCell: GameCell,
  locale: string,
  t: (key: string) => any
) {
  const prevHas = hasContent(prevCell);
  const nextHas = hasContent(nextCell);

  let editType: "set" | "change" | "clear" | null = null;
  if (!prevHas && nextHas) editType = "set";
  else if (prevHas && nextHas) editType = "change";
  else if (prevHas && !nextHas) editType = "clear";

  if (!editType) return;

  const defaultTitles = t("cell_titles") as string[];
  const cellSlot = getCellSlot(nextCell.id);
  const defaultTitle = defaultTitles[nextCell.id];
  const isDefaultTitle = !!defaultTitle && nextCell.title === defaultTitle;

  const cellLabel = isDefaultTitle
    ? cellSlot
    : (nextCell.title || "").slice(0, 80);

  const gameName = nextCell.name
    ? nextCell.name.slice(0, 80)
    : nextCell.image
      ? "__image_only__"
      : "";

  trackEvent("grid_cell_edit", {
    grid_locale: locale,
    grid_version: "v2",
    cell_slot: cellSlot,
    edit_type: editType,
    cell_title_kind: isDefaultTitle ? "default" : "custom",
    cell_label: cellLabel,
    game_name: gameName,
  });
}

export function GameGrid({ initialCells, onUpdateCells }: GameGridProps) {
  // Canvas相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<GameCell[]>(initialCells);
  const lastSignatureRef = useRef<string | null>(null);
  
  // 全局配置状态
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    mainTitle: ""
  });
  const { t, locale } = useI18n();

  useEffect(() => {
    // 每个语系独立的默认标题与存储键
    const storageKey = `gameGridGlobalConfig_${locale}`;
    const savedConfig = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setGlobalConfig(parsed);
        if (typeof document !== "undefined" && parsed.mainTitle) {
          document.title = parsed.mainTitle;
        }
      } catch {}
    } else {
      const defaultTitle = String(t("global.main_title"));
      setGlobalConfig((prev) => ({ ...prev, mainTitle: defaultTitle }));
      if (typeof document !== "undefined") {
        document.title = defaultTitle;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  
  // 搜索与编辑状态
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isMainTitleDialogOpen, setIsMainTitleDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  
  // 当cells状态发生变化时，通知父组件
  useEffect(() => {
    onUpdateCells(cells);
  }, [cells, onUpdateCells]);

  // 打开搜索对话框
  const openSearchDialog = (cellId: number) => {
    setSelectedCellId(cellId);
    setIsSearchDialogOpen(true);
  };

  // 打开标题编辑对话框
  const openTitleEditDialog = (cellId: number) => {
    setSelectedCellId(cellId);
    setEditingText(cells[cellId].title);
    setIsTitleDialogOpen(true);
  };

  // 打开游戏名称编辑对话框
  const openNameEditDialog = (cellId: number) => {
    setSelectedCellId(cellId);
    setEditingText(cells[cellId].name || "");
    setIsNameDialogOpen(true);
  };

  // 打开主标题编辑对话框
  const openMainTitleEditDialog = () => {
    setEditingText(globalConfig.mainTitle);
    setIsMainTitleDialogOpen(true);
  };

  // 处理拖拽图片 - 打开裁剪对话框
  const handleImageDrop = async (cellId: number, file: File) => {
    setSelectedCellId(cellId);
    
    // 限制图片大小为3MB
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_FILE_SIZE) {
      alert(t('error.file_too_large', { size: '3MB' }) || '图片文件过大，请上传小于3MB的图片');
      return;
    }

    try {
      // 读取文件为 Data URL
      const imageSrc = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to read image'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // 预加载图片以验证数据有效性
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Invalid image format'));
        img.src = imageSrc;
      });

      // 确保图片完全加载后再设置状态
      setUploadedImageSrc(imageSrc);
      
      // 使用 setTimeout 确保状态更新后再打开对话框
      setTimeout(() => {
        setIsCropDialogOpen(true);
      }, 100);
    } catch (error) {
      console.error('读取拖拽图片失败:', error);
      alert(t('error.image_load_failed_select_another'));
    }
  };

  // 使用自定义hooks处理Canvas渲染
  const { scale, drawCanvas } = useCanvasRenderer({ 
    canvasRef, 
    cells, 
    setCells, 
    dragOverCellId: null,
    globalConfig
  });

  // 使用自定义hooks管理Canvas渲染
  const { 
    dragOverCellId: currentDragOverCellId, 
    handleCanvasClick, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    generateImage 
  } = useCanvasEvents({
    cells,
    setCells,
    scale,
    openSearchDialog,
    openTitleEditDialog,
    openNameEditDialog,
    openMainTitleEditDialog,
    onImageDrop: handleImageDrop,
    forceCanvasRedraw: drawCanvas,
  });

  // 更新 useCanvasRenderer 以使用当前的 dragOverCellId
  useEffect(() => {
    if (drawCanvas) {
      drawCanvas();
    }
  }, [currentDragOverCellId, globalConfig, drawCanvas]);

  const handleGenerate = () => {
    const signature = buildSignature(locale, globalConfig.mainTitle, cells);
    if (lastSignatureRef.current === signature) {
      // 内容未变化，仅生成图片，不重复统计
      generateImage(canvasRef);
      return;
    }
    lastSignatureRef.current = signature;

    const defaultTitles = t("cell_titles") as string[];
    const totalCells = cells.length;
    const filledCells = cells.filter((cell) => hasContent(cell));
    const isDefaultMainTitle = globalConfig.mainTitle === String(t("global.main_title"));

    trackEvent("grid_generated", {
      grid_locale: locale,
      grid_version: "v2",
      grid_total_cells: totalCells,
      grid_filled_cells: filledCells.length,
      grid_title_kind: isDefaultMainTitle ? "default" : "custom",
      grid_title: (globalConfig.mainTitle || "").slice(0, 80),
    });

    const filledSlots: string[] = [];
    const customTitleSlots: string[] = [];

    cells.forEach((cell) => {
      if (!hasContent(cell)) return;

      const cellSlot = getCellSlot(cell.id);
      const defaultTitle = defaultTitles[cell.id];
      const isDefaultTitle = !!defaultTitle && cell.title === defaultTitle;

      filledSlots.push(cellSlot);
      if (!isDefaultTitle) {
        customTitleSlots.push(cellSlot);
      }
    });

    trackEvent("grid_grid_snapshot_pack", {
      grid_locale: locale,
      grid_version: "v2",
      grid_total_cells: totalCells,
      grid_filled_cells: filledCells.length,
      grid_filled_slots: filledSlots.join(","),
      grid_custom_title_slots: customTitleSlots.join(","),
    });

    generateImage(canvasRef);
  };

  // 保存标题更改
  const handleSaveTitle = (newText: string) => {
    if (selectedCellId === null) return;

    const updatedCell: GameCell = {
      ...cells[selectedCellId],
      title: newText,
    };

    setCells(cells.map((cell) => (cell.id === selectedCellId ? updatedCell : cell)));
    // 每个语系单独存储标题映射
    try {
      const key = `gameGridTitles_${locale}`;
      const raw = localStorage.getItem(key);
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      map[String(selectedCellId)] = newText;
      localStorage.setItem(key, JSON.stringify(map));
    } catch {}
    setIsTitleDialogOpen(false);
  };

  // 保存游戏名称更改
  const handleSaveName = (newText: string) => {
    if (selectedCellId === null) return;

    const prevCell = cells[selectedCellId];
    const updatedCell: GameCell = {
      ...prevCell,
      name: newText,
    };

    setCells(cells.map((cell) => (cell.id === selectedCellId ? updatedCell : cell)));
    trackCellEditEvent(prevCell, updatedCell, locale, t);
    saveToIndexedDB(updatedCell);
    setIsNameDialogOpen(false);
  };

  // 保存主标题更改
  const handleSaveMainTitle = (newText: string) => {
    const updatedConfig = {
      ...globalConfig,
      mainTitle: newText
    };
    
    setGlobalConfig(updatedConfig);
    setIsMainTitleDialogOpen(false);
    
    // 保存到localStorage
    const storageKey = `gameGridGlobalConfig_${locale}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedConfig));
    
    // 更新页面标题
    if (typeof document !== "undefined") {
      document.title = newText;
    }
  };

  // 加载全局配置
  // 旧版存储迁移（如存在）
  useEffect(() => {
    const legacy = typeof window !== "undefined" ? localStorage.getItem("gameGridGlobalConfig") : null;
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        const storageKey = `gameGridGlobalConfig_${locale}`;
        localStorage.setItem(storageKey, JSON.stringify(parsed));
        localStorage.removeItem("gameGridGlobalConfig");
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // 选择游戏
  const handleSelectGame = async (game: GameSearchResult) => {
    if (selectedCellId === null) return;

    const prevCell = cells[selectedCellId];
    
    // 使用代理URL替换直接的外部URL
    // const proxyImageUrl = `/api/proxy?url=${encodeURIComponent(game.image)}`;
    
    // 🟢 改用 wsrv.nl 公共代理
    // &output=png 保证透明背景兼容，&w=400 限制尺寸节省用户流量
    const proxyImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(game.image)}&output=png&w=400&il`; 

    try {
      // 先更新UI显示，让用户知道正在处理
      const tempUpdatedCell: GameCell = {
        ...prevCell,
        name: game.name,
        image: proxyImageUrl, // 临时使用代理URL
        imageObj: null,
      };
      
      setCells(cells.map((cell) => (cell.id === selectedCellId ? tempUpdatedCell : cell)));
      
      // 关闭搜索对话框，不挡着后续的UI操作
      setIsSearchDialogOpen(false);
      
      // 获取图片并转换为base64
      const response = await fetch(proxyImageUrl);
      const blob = await response.blob();
      
      // 创建图片对象进行裁切
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // 创建canvas进行裁切
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法获取canvas上下文');
      
      // 计算裁切尺寸
      const targetRatio = 3/4;
      const imgRatio = img.width / img.height;
      let cropWidth = img.width;
      let cropHeight = img.height;
      let cropX = 0;
      let cropY = 0;
      
      if (imgRatio > targetRatio) {
        // 图片更宽，需要裁切宽度
        cropWidth = img.height * targetRatio;
        cropX = (img.width - cropWidth) / 2;
      } else {
        // 图片更高，需要裁切高度
        cropHeight = img.width / targetRatio;
        cropY = (img.height - cropHeight) / 2;
      }
      
      // 设置canvas尺寸为裁切后的尺寸
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // 执行裁切
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      // 将裁切后的图片转换为base64
      const base64Url = canvas.toDataURL('image/jpeg', 0.9);
      
      // 清理资源
      URL.revokeObjectURL(img.src);
      
      // 使用base64格式的URL更新cell
      const finalUpdatedCell: GameCell = {
        ...prevCell,
        image: base64Url,
        name: game.name,
        imageObj: null,
      };
      
      setCells(cells.map((cell) => (cell.id === selectedCellId ? finalUpdatedCell : cell)));
      trackCellEditEvent(prevCell, finalUpdatedCell, locale, t);
      
      // 保存到IndexedDB
      saveToIndexedDB(finalUpdatedCell);
    } catch (error) {
      console.error("转换图片为base64时出错:", error);
      // 如果转换失败，使用原始代理URL作为fallback
      const fallbackCell: GameCell = {
        ...prevCell,
        image: proxyImageUrl,
        name: game.name,
        imageObj: null,
      };
      
      setCells(cells.map((cell) => (cell.id === selectedCellId ? fallbackCell : cell)));
      trackCellEditEvent(prevCell, fallbackCell, locale, t);
      saveToIndexedDB(fallbackCell);
    }
  };

  // 处理图片上传 - 打开裁剪对话框
  const handleImageUpload = async (file: File) => {
    if (selectedCellId === null) return;

    // 限制图片大小为3MB
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_FILE_SIZE) {
      alert(t('error.file_too_large', { size: '3MB' }) || '图片文件过大，请上传小于3MB的图片');
      return;
    }

    try {
      // 读取文件为 Data URL
      const imageSrc = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Failed to read image'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // 预加载图片以验证数据有效性
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Invalid image format'));
        img.src = imageSrc;
      });

      // 确保图片完全加载后再设置状态
      setUploadedImageSrc(imageSrc);
      setIsSearchDialogOpen(false); // 关闭搜索对话框
      
      // 使用 setTimeout 确保状态更新后再打开对话框
      setTimeout(() => {
        setIsCropDialogOpen(true);
      }, 100);
    } catch (error) {
      console.error('读取上传图片失败:', error);
      alert(t('error.image_load_failed_select_another'));
    }
  };

  // 处理裁剪确认
  const handleCropConfirm = async (croppedImageBase64: string) => {
    if (selectedCellId === null) return;

    const prevCell = cells[selectedCellId];

    try {
      // 更新单元格
      const updatedCell: GameCell = {
        ...prevCell,
        image: croppedImageBase64,
        imageObj: null,
      };

      setCells(cells.map((cell) => (cell.id === selectedCellId ? updatedCell : cell)));
      trackCellEditEvent(prevCell, updatedCell, locale, t);
      saveToIndexedDB(updatedCell);

      // 清理状态
      setUploadedImageSrc(null);
    } catch (error) {
      console.error('保存裁剪图片失败:', error);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="cursor-pointer"
        style={{
          width: `${CANVAS_CONFIG.width * scale}px`,
          height: `${CANVAS_CONFIG.height * scale}px`,
          maxWidth: "100%",
        }}
      />

      <p className="mt-4 px-4 text-sm text-gray-500 break-words">
        {t('ui.tip_edit')}
      </p>

      <Button 
        onClick={handleGenerate} 
        className="mt-6 px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 whitespace-normal text-center"
      >
        {t('ui.generate', { title: globalConfig.mainTitle })}
      </Button>

      {/* 游戏搜索对话框 */}
      <GameSearchDialog 
        isOpen={isSearchDialogOpen} 
        onOpenChange={setIsSearchDialogOpen} 
        onSelectGame={handleSelectGame}
        onUploadImage={handleImageUpload}
      />
      
      {/* 标题编辑对话框 */}
      <TextEditDialog
        isOpen={isTitleDialogOpen}
        onOpenChange={setIsTitleDialogOpen}
        title={String(t('dialog.edit_title'))}
        defaultValue={editingText}
        onSave={handleSaveTitle}
      />
      
      {/* 游戏名称编辑对话框 */}
      <TextEditDialog
        isOpen={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        title={String(t('dialog.edit_game_name'))}
        defaultValue={editingText}
        onSave={handleSaveName}
      />

      {/* 主标题编辑对话框 */}
      <TextEditDialog
        isOpen={isMainTitleDialogOpen}
        onOpenChange={setIsMainTitleDialogOpen}
        title={String(t('dialog.edit_main_title'))}
        defaultValue={editingText}
        onSave={handleSaveMainTitle}
      />

      {/* 图片裁剪对话框 */}
      <ImageCropDialog
        isOpen={isCropDialogOpen}
        onOpenChange={setIsCropDialogOpen}
        imageSrc={uploadedImageSrc}
        onConfirm={handleCropConfirm}
      />
    </>
  )
}

/**
 * 游戏格子类型定义
 */
export interface GameCell {
  id: number;
  title: string;
  image?: string;
  name?: string;
  description?: string;
  imageObj?: HTMLImageElement | null;
}

/**
 * 全局配置类型
 */
export interface GlobalConfig {
  mainTitle: string;
  gridCols: number;
}

/**
 * Canvas绘图命令类型
 */
export interface DrawCommand {
  cmd: string;
  args?: unknown[];
}

/**
 * Canvas配置类型
 */
export interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
  titleHeight: number;
  gridRows: number;
  gridCols: number;
  cellPadding: number;
  cellBorderWidth: number;
  cellBorderRadius: number;
  cellAspectRatio: number;
  coverRatio: number;
  titleFontSize: number;
  cellTitleFontSize: number;
  cellNameFontSize: number;
  cellTitleMargin: number;
  cellNameMargin: number;
  cellDescriptionFontSize: number;
  cellDescriptionMargin: number;
}

/**
 * 搜索游戏结果项
 */
export interface GameSearchResult {
  id?: number | string;
  name: string;
  image: string;
}

/**
 * IndexedDB配置
 */
export interface DBConfig {
  name: string;
  storeName: string;
  version: number;
}

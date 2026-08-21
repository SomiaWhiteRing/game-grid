import { CANVAS_CONFIG } from "../constants";

export const MIN_GRID_COLUMNS = 3;
export const MAX_GRID_COLUMNS = 8;
export const DEFAULT_GRID_COLUMNS = CANVAS_CONFIG.gridCols;

export interface GridLayout {
  width: number;
  height: number;
  padding: number;
  titleHeight: number;
  gridCols: number;
  gridRows: number;
  gridTop: number;
  gridWidth: number;
  gridHeight: number;
  cellWidth: number;
  cellHeight: number;
  coverWidth: number;
  coverHeight: number;
}

export function normalizeGridColumns(value: number | string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_GRID_COLUMNS;
  return Math.min(MAX_GRID_COLUMNS, Math.max(MIN_GRID_COLUMNS, Math.round(parsed)));
}

/** Keep covers at 3:4 while deriving the required rows from the column count. */
export function getGridLayout(gridColumns: number | undefined, cellCount: number): GridLayout {
  const gridCols = normalizeGridColumns(gridColumns);
  const gridRows = Math.max(1, Math.ceil(cellCount / gridCols));
  const width = CANVAS_CONFIG.width;
  const padding = CANVAS_CONFIG.padding;
  const titleHeight = CANVAS_CONFIG.titleHeight;
  const gridTop = padding + titleHeight;
  const gridWidth = width - padding * 2;
  const cellWidth = gridWidth / gridCols;
  const coverWidth = Math.max(
    1,
    cellWidth - CANVAS_CONFIG.cellPadding * 2 - CANVAS_CONFIG.cellBorderWidth * 2
  );
  const coverHeight = coverWidth / CANVAS_CONFIG.coverRatio;
  const cellHeight =
    coverHeight +
    CANVAS_CONFIG.cellPadding * 2 +
    CANVAS_CONFIG.cellBorderWidth * 2 +
    CANVAS_CONFIG.cellTitleMargin +
    CANVAS_CONFIG.cellTitleFontSize +
    CANVAS_CONFIG.cellNameMargin +
    CANVAS_CONFIG.cellNameFontSize +
    CANVAS_CONFIG.cellDescriptionMargin +
    CANVAS_CONFIG.cellDescriptionFontSize +
    24;
  const gridHeight = cellHeight * gridRows;

  return {
    width,
    height: Math.ceil(gridTop + gridHeight + padding),
    padding,
    titleHeight,
    gridCols,
    gridRows,
    gridTop,
    gridWidth,
    gridHeight,
    cellWidth,
    cellHeight,
    coverWidth,
    coverHeight,
  };
}

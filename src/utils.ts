export const convertToRowCol = (i: number): number[] => {
  let row = 0,
    col = 0
  if (i < 10) return [row, i]
  row = Math.floor(i / 10)
  col = i % 10
  return [row, col]
}

export const convertCellToIndex = (cell: number[]): number => cell[0] * 10 + cell[1]

export const getRange = (start: number, end: number): number[] =>
  start <= end ? [start, end] : [end, start]

export const getSelectedSquares = (startCell: number[], endCell: number[]): number[] => {
  const squares = []
  const [startRow, endRow] = getRange(startCell[0], endCell[0])
  const [startCol, endCol] = getRange(startCell[1], endCell[1])

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      // Only include valid squares (within our 10x10 grid)
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        squares.push([row, col])
      }
    }
  }

  return squares.map(convertCellToIndex)
}

export interface SelectionBounds {
  minRow: number
  maxRow: number
  minCol: number
  maxCol: number
}

export const getSelectionBounds = (selectedSquares: Set<number>): SelectionBounds | null => {
  if (selectedSquares.size === 0) return null

  const coordinates = Array.from(selectedSquares).map(convertToRowCol)
  const rows = coordinates.map(([row]) => row)
  const cols = coordinates.map(([, col]) => col)

  return {
    minRow: Math.min(...rows),
    maxRow: Math.max(...rows),
    minCol: Math.min(...cols),
    maxCol: Math.max(...cols),
  }
}

export interface BorderStates {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export const convertSquareAndSectionToCorner = (
  squareIndex: number,
  section?: number
): number[] => {
  const [baseRow, baseCol] = convertToRowCol(squareIndex)

  // If no section specified, use the top-left corner of the square
  if (section === undefined) {
    return [baseRow, baseCol]
  }

  // Convert to corner coordinates (11x11 grid of corners for 10x10 grid of squares)
  // Each square [r,c] has corners at [r,c], [r,c+1], [r+1,c], [r+1,c+1]
  switch (section) {
    case 0: // top-left corner
      return [baseRow, baseCol]
    case 1: // top-right corner
      return [baseRow, baseCol + 1]
    case 2: // bottom-left corner
      return [baseRow + 1, baseCol]
    case 3: // bottom-right corner
      return [baseRow + 1, baseCol + 1]
    default:
      return [baseRow, baseCol]
  }
}

export const getSelectedSquaresFromCorners = (
  startCorner: number[],
  endCorner: number[]
): number[] => {
  const squares = []

  // Get the rectangle bounds in corner coordinates
  const minRow = Math.min(startCorner[0], endCorner[0])
  const maxRow = Math.max(startCorner[0], endCorner[0])
  const minCol = Math.min(startCorner[1], endCorner[1])
  const maxCol = Math.max(startCorner[1], endCorner[1])

  // Convert corner coordinates to square coordinates
  // Corner [r,c] is the top-left of square [r,c]
  // So we select squares from [minRow, minCol] to [maxRow-1, maxCol-1]
  for (let row = minRow; row < maxRow; row++) {
    for (let col = minCol; col < maxCol; col++) {
      // Only include valid squares (within our 10x10 grid)
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        squares.push([row, col])
      }
    }
  }

  return squares.map(convertCellToIndex)
}

export const getBorderStates = (
  squareIndex: number,
  selectedSquares: Set<number>
): BorderStates => {
  const bounds = getSelectionBounds(selectedSquares)
  if (!bounds) {
    return { top: false, right: false, bottom: false, left: false }
  }

  const [row, col] = convertToRowCol(squareIndex)
  const isSelected = selectedSquares.has(squareIndex)

  // Check if this square is on the border of the selection
  const borders = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  if (isSelected) {
    // If selected, highlight borders that are on the edge of the selection
    borders.top = row === bounds.minRow
    borders.bottom = row === bounds.maxRow
    borders.left = col === bounds.minCol
    borders.right = col === bounds.maxCol
  } else {
    // If not selected, highlight borders if adjacent to selection
    borders.bottom = row === bounds.minRow - 1 && col >= bounds.minCol && col <= bounds.maxCol
    borders.top = row === bounds.maxRow + 1 && col >= bounds.minCol && col <= bounds.maxCol
    borders.right = col === bounds.minCol - 1 && row >= bounds.minRow && row <= bounds.maxRow
    borders.left = col === bounds.maxCol + 1 && row >= bounds.minRow && row <= bounds.maxRow
  }

  return borders
}

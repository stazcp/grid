export const convertToRowCol = (i: number): number[] => {
  let row = 0,
    col = 0
  if (i < 10) return [row, i]
  row = Math.floor(i / 10)
  col = i % 10
  return [row, col]
}

export const convertCellToIndex = (cell: number[]): number => Number(cell.join(''))

export const getRange = (start: number, end: number): number[] =>
  start <= end ? [start, end] : [end, start]

export const getSelectedSquares = (startCell: number[], endCell: number[]): number[] => {
  const squares = []
  const [startRow, endRow] = getRange(startCell[0], endCell[0])
  const [startCol, endCol] = getRange(startCell[1], endCell[1])

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      squares.push([row, col])
    }
  }

  return squares.map(convertCellToIndex)
}

import { useMemo, useState } from 'react'
import { convertToRowCol } from '../utils'

interface SquareProps {
  i: number
  squareHovered: number | undefined
  selectedSquares: Set<number> | undefined
  handleMouseOver: (i: number) => void
  handleMouseDown: (i: number) => void
  handleMouseUp: (i: number) => void
}

const OUTLINE_COLOR = 'rgba(0, 217, 255, 1)'
const OUTLINE_BORDER_STYLE = `1px solid  ${OUTLINE_COLOR}`
const BASIC_BORDER_STYLE = `1px solid blue`

const Square = ({
  i,
  squareHovered,
  selectedSquares,
  handleMouseOver,
  handleMouseDown,
  handleMouseUp,
}: SquareProps) => {
  const [sectionHover, setSectionHover] = useState<number>()

  const selectionGrid = useMemo(() => {
    if (selectedSquares === undefined) return []
    return [...selectedSquares].map(convertToRowCol)
  }, [selectedSquares])

  const color = useMemo(() => {
    if (selectedSquares?.has(i)) return 'rgba(173, 216, 230, 0.5)'
    if (squareHovered == i) return 'rgba(173, 216, 230, 0.25)'
    return ''
  }, [selectedSquares, squareHovered, i])

  const getDotPosition = (i: number) => {
    switch (i) {
      case 0:
        return { top: -4, left: -4 }
      case 1:
        return { top: -4, right: -4 }
      case 2:
        return { bottom: -4, left: -4 }
      case 3:
        return { bottom: -4, right: -4 }
    }
  }

  const isTopBorder = (): boolean => {
    if (selectedSquares == undefined || !selectionGrid.length) return false
    // if first row
    const [row, col] = convertToRowCol(i)
    if (row === selectionGrid[0][0] && selectedSquares.has(i)) return true

    // or one after last
    if (
      row === selectionGrid[selectionGrid.length - 1][0] + 1 &&
      selectionGrid.find((cell) => cell[1] === col)
    )
      return true
    return false
  }

  const isLeftBorder = (): boolean => {
    if (selectedSquares == undefined || !selectionGrid.length) return false
    // if first col
    const [row, col] = convertToRowCol(i)
    if (col === selectionGrid[0][1] && selectedSquares.has(i)) return true

    // if after last col
    if (
      col === selectionGrid[selectionGrid.length - 1][1] + 1 &&
      selectionGrid.find((cell) => cell[0] === row)
    )
      return true
    return false
  }

  const isBottomBorder = (): Boolean => {
    if (selectedSquares == undefined || !selectionGrid.length) return false
    // last row
    const [row, col] = convertToRowCol(i)
    if (row === selectionGrid[selectionGrid.length - 1][0] && selectedSquares.has(i)) return true

    // one before first
    if (row === selectionGrid[0][0] - 1 && selectionGrid.find((cell) => cell[1] === col))
      return true
    return false
  }

  const isRightBorder = (): Boolean => {
    if (selectedSquares == undefined || !selectionGrid.length) return false

    // last col
    const [row, col] = convertToRowCol(i)
    if (col === selectionGrid[selectionGrid.length - 1][1] && selectedSquares.has(i)) return true

    // one before first
    if (col === selectionGrid[0][1] - 1 && selectionGrid.find((cell) => cell[0] === row))
      return true
    return false
  }

  return (
    <div
      key={i}
      style={{
        borderLeft: isLeftBorder() ? OUTLINE_BORDER_STYLE : BASIC_BORDER_STYLE,
        borderTop: isTopBorder() ? OUTLINE_BORDER_STYLE : BASIC_BORDER_STYLE,
        borderBottom: isBottomBorder() ? OUTLINE_BORDER_STYLE : BASIC_BORDER_STYLE,
        borderRight: isRightBorder() ? OUTLINE_BORDER_STYLE : BASIC_BORDER_STYLE,
        backgroundColor: color,
        display: 'grid',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
      onMouseOver={() => handleMouseOver(i)}
      onMouseDown={() => handleMouseDown(i)}
      onMouseUp={() => handleMouseUp(i)}
    >
      {Array.from({ length: 4 }, (_, j) => (
        <div
          key={j}
          style={{ position: 'relative' }}
          onMouseOver={() => setSectionHover(j)}
          onMouseOut={() => setSectionHover(undefined)}
        >
          <div
            style={
              sectionHover == j
                ? {
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: OUTLINE_COLOR,
                    position: 'absolute',
                    overflow: 'visible',
                    ...getDotPosition(j),
                  }
                : {}
            }
          />
        </div>
      ))}
    </div>
  )
}

export default Square

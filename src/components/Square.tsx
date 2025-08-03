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

const Square = ({
  i,
  squareHovered,
  selectedSquares,
  handleMouseOver,
  handleMouseDown,
  handleMouseUp,
}: SquareProps) => {
  const [sectionHover, setSectionHover] = useState<number>()

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

  return (
    <div
      key={i}
      style={{
        border: '1px solid blue',
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
                    backgroundColor: 'blue',
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

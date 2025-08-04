import { useMemo } from 'react'
import { getBorderStates } from '../utils'

interface SquareProps {
  i: number
  squareHovered: number | undefined
  selectedSquares: Set<number> | undefined
  handleMouseOver: (i: number, section?: number) => void
  handleMouseDown: (i: number, section?: number) => void
  handleMouseUp: () => void
}

const Square = ({
  i,
  squareHovered,
  selectedSquares,
  handleMouseOver,
  handleMouseDown,
  handleMouseUp,
}: SquareProps) => {
  const borderStates = useMemo(() => {
    if (!selectedSquares) return { top: false, right: false, bottom: false, left: false }
    return getBorderStates(i, selectedSquares)
  }, [selectedSquares, i])

  const squareClasses = useMemo(() => {
    const classes = ['grid-square']

    if (selectedSquares?.has(i)) classes.push('selected')
    if (squareHovered === i) classes.push('hovered')
    if (borderStates.top) classes.push('border-top')
    if (borderStates.right) classes.push('border-right')
    if (borderStates.bottom) classes.push('border-bottom')
    if (borderStates.left) classes.push('border-left')

    return classes.join(' ')
  }, [selectedSquares, squareHovered, i, borderStates])

  const getDotClass = (index: number): string => {
    // Map each section to its outer corner position
    const positions = [
      'outer-top-left',
      'outer-top-right',
      'outer-bottom-left',
      'outer-bottom-right',
    ]
    return `corner-dot ${positions[index]}`
  }

  const handleSectionMouseOver = (section: number) => {
    handleMouseOver(i, section)
  }

  const handleSectionMouseDown = (section: number) => {
    handleMouseDown(i, section)
  }

  const handleSectionMouseUp = () => {
    handleMouseUp()
  }

  return (
    <div className={squareClasses}>
      {Array.from({ length: 4 }, (_, j) => (
        <div
          key={j}
          className="square-section"
          onMouseOver={() => handleSectionMouseOver(j)}
          onMouseDown={() => handleSectionMouseDown(j)}
          onMouseUp={handleSectionMouseUp}
        >
          <div className={getDotClass(j)} />
        </div>
      ))}
    </div>
  )
}

export default Square

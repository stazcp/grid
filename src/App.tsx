import { useEffect, useState } from 'react'
import './App.css'
import img from './assets/image.jpg'
import { convertToRowCol, getSelectedSquares } from './utils'
import Square from './components/Square'

function App() {
  const [squareHovered, setSquareHovered] = useState<number>()
  const [mouseDown, setMouseDown] = useState<number>()
  const [mouseUp, setMouseUp] = useState<number>()
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(new Set())

  const handleMouseOver = (i: number) => {
    setSquareHovered(i)
  }

  const handleMouseDown = (i: number) => {
    setMouseDown(i)
  }

  const handleMouseUp = (i: number) => {
    setMouseUp(i)
    setMouseDown(undefined)
  }

  useEffect(() => {
    if (mouseDown === undefined || squareHovered == undefined) return
    const startCell = convertToRowCol(mouseDown)
    const endCell = convertToRowCol(squareHovered)
    const squares = getSelectedSquares(startCell, endCell)
    setSelectedSquares(new Set(squares))
  }, [mouseDown, squareHovered])

  return (
    <div
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '90vh',
        width: '90vw',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'repeat(10 ,1fr)',
        gridTemplateColumns: 'repeat(10 ,1fr)',
      }}
    >
      {Array.from({ length: 100 }, (_, i) => (
        <Square
          key={i}
          i={i}
          squareHovered={squareHovered}
          selectedSquares={selectedSquares}
          handleMouseDown={handleMouseDown}
          handleMouseOver={handleMouseOver}
          handleMouseUp={handleMouseUp}
        />
      ))}
    </div>
  )
}

export default App

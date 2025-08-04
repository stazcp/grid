import { useEffect, useState } from 'react'
import './App.css'
import img from './assets/ai-image.png'
import { getSelectedSquaresFromCorners, convertSquareAndSectionToCorner } from './utils'
import Square from './components/Square'

function App() {
  const [squareHovered, setSquareHovered] = useState<number>()
  const [sectionHovered, setSectionHovered] = useState<number>()
  const [mouseDown, setMouseDown] = useState<number>()
  const [mouseDownSection, setMouseDownSection] = useState<number>()
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(new Set())

  const handleMouseOver = (i: number, section?: number) => {
    setSquareHovered(i)
    setSectionHovered(section)
  }

  const handleMouseDown = (i: number, section?: number) => {
    setMouseDown(i)
    setMouseDownSection(section)
  }

  const handleMouseUp = () => {
    setMouseDown(undefined)
    setMouseDownSection(undefined)
  }

  useEffect(() => {
    if (mouseDown === undefined || squareHovered == undefined) return

    // Use precise corner coordinates based on section positions
    const startCorner = convertSquareAndSectionToCorner(mouseDown, mouseDownSection)
    const endCorner = convertSquareAndSectionToCorner(squareHovered, sectionHovered)

    const squares = getSelectedSquaresFromCorners(startCorner, endCorner)
    setSelectedSquares(new Set(squares))
  }, [mouseDown, mouseDownSection, squareHovered, sectionHovered])

  return (
    <div className="app">
      <div className="grid-container">
        <div className="image-grid" style={{ backgroundImage: `url(${img})` }}>
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
      </div>
    </div>
  )
}

export default App

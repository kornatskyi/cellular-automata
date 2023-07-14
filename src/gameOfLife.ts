import './styles/index.scss'
import { Cell } from './classes/Cell'
import { Renderer } from './classes/Renderer'

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}

class GameOfLife {
  cells: Cell[] = []

  private n = 50
  constructor() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        this.cells[(i * this.n) + j] = new Cell(false, { x: j * Cell.width, y: i * Cell.height })
      }
    }
  }
}

const r = new Renderer()
// const ctx = r.ctx
// const cellSize = Cell.width
// const n = 50
// r.renderCallback = () => {
//   ctx.font = '10px Arial'
//   ctx.textAlign = 'center'
//   ctx.textBaseline = 'middle'

//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       // Calculate the top-left corner of this cell
//       const x = i * cellSize
//       const y = j * cellSize

//       // Draw the cell
//       ctx.strokeRect(x, y, cellSize, cellSize)

//       // Calculate the cell number
//       const cellNumber = i * n + j

//       // Draw the cell number
//       ctx.fillText(cellNumber.toString(), x + cellSize / 2, y + cellSize / 2)
//     }
//   }
// }
// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
// These rules, which compare the behaviour of the automaton to real life, can be condensed into the following:

// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.
const GOF = new GameOfLife()
r.addThingsToDraw(GOF.cells)
r.start()

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
  renderer: Renderer

  private n = 50
  constructor(renderer: Renderer) {
    this.renderer = renderer
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        this.cells[i * this.n + j] = new Cell(false, { x: j * Cell.width, y: i * Cell.height })
      }
    }

    // *** Add control panel ***
    const cP = document.getElementById('control-panel')
    if (cP) {
      const iButton = cP.appendChild(document.createElement('button'))
      iButton.textContent = 'Update'
      iButton.onclick = () => {
        GOF.update()
        this.renderer.thingsToDraw = GOF.cells
      }
    }

    // *** Activate cells on the Canvas ***
    let mouseDown = false
    this.renderer.canvas.addEventListener('mousedown', () => {
      mouseDown = true
    })

    this.renderer.canvas.addEventListener('mouseup', () => {
      mouseDown = false
    })

    this.renderer.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (mouseDown) {
        const rect = this.renderer.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // Iterate over all cells
        for (const cell of GOF.cells) {
          // Check if the click was inside this cell
          if (x >= cell.position.x && x < cell.position.x + Cell.width && y >= cell.position.y && y < cell.position.y + Cell.height) {
            // Click was inside this cell, toggle its state
            cell.onClick()
            break
          }
        }
      }
    })

    // Use the existing click listener to initialize the selection
    this.renderer.canvas.addEventListener('click', (event: MouseEvent) => {
      const rect = this.renderer.canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Iterate over all cells
      for (const cell of GOF.cells) {
        // Check if the click was inside this cell
        if (x >= cell.position.x && x < cell.position.x + Cell.width && y >= cell.position.y && y < cell.position.y + Cell.height) {
          // Click was inside this cell, toggle its state
          cell.onClick()
          break
        }
      }
    })
  }

  getNeighbors(cellNumber: number): number[] {
    const neighbors: number[] = []

    const cellPosition = {
      x: cellNumber % this.n,
      y: Math.floor(cellNumber / this.n),
    }

    // Offset to find the neighbors
    const offsets = [
      [-1, -1], // Top left
      [-1, 0], // Top
      [-1, 1], // Top right
      [0, -1], // Left
      [0, 1], // Right
      [1, -1], // Bottom left
      [1, 0], // Bottom
      [1, 1], // Bottom right
    ]

    for (const offset of offsets) {
      const newY = cellPosition.y + offset[0]
      const newX = cellPosition.x + offset[1]

      // Check if the neighbor is within the grid
      if (newX >= 0 && newX < this.n && newY >= 0 && newY < this.n) {
        neighbors.push(newY * this.n + newX)
      }
    }

    return neighbors
  }

  update() {
    const nextState: Cell[] = new Array(this.cells.length)
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    // These rules, which compare the behaviour of the automaton to real life, can be condensed into the following:

    // Any live cell with two or three live neighbours survives.
    // Any dead cell with three live neighbours becomes a live cell.
    // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
    this.cells.forEach((cell, i) => {
      let aliveNeighbors = 0
      const neighbors = this.getNeighbors(i)

      neighbors.forEach((n) => {
        if (this.cells[n].alive) {
          aliveNeighbors++
        }
      })

      if (cell.alive) {
        // Check rules 1, 2 and 3
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          // The cell dies
          nextState[i] = new Cell(false, cell.position)
        } else {
          // The cell survives
          nextState[i] = new Cell(true, cell.position)
        }
      } else {
        // Check rule 4
        if (aliveNeighbors === 3) {
          // The cell comes alive
          nextState[i] = new Cell(true, cell.position)
        } else {
          // The cell stays dead
          nextState[i] = new Cell(false, cell.position)
        }
      }
    })

    // Swap cells with nextState for the next tick
    this.cells = nextState
  }

  start() {
    this.renderer.addThingsToDraw(this.cells)
    this.renderer.start()
  }
}

const GOF = new GameOfLife(new Renderer())

GOF.start()

const u = () => {
  setTimeout(() => {
    GOF.update()
    GOF.renderer.thingsToDraw = GOF.cells
    u()
  }, 10)
}
// u()
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

function twoFramesArray(currentFrame: Cell[], nextFrame: Cell[]) {
  // Helper function to convert an array of Cells to a CSV string
  const arrayToCSVString = (array: Cell[]): string => {
    return array.map((cell) => (cell.alive ? '1' : '0')).join(',')
  }

  // Convert arrays to CSV format
  const csvContentArray1 = arrayToCSVString(currentFrame)
  const csvContentArray2 = arrayToCSVString(nextFrame)

  // Combine both arrays in one CSV, separating them with a newline
  return `${csvContentArray1},${csvContentArray2}`
}

function genCSV(csvContent: string): void {
  // Determine the number of columns for each state (current and next)
  const numOfColumns = csvContent.split(',').length // Assuming the first line represents the "current" state

  // Function to generate zero-padded numbers
  function zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0')
  }

  // Generate column headers
  const columns = []
  for (let i = 0; i < numOfColumns; i++) {
    // Generate zero-padded column number
    const columnNumber = zeroPad(i, 2) // Change 2 to the maximum number of digits you expect
    columns.push(`current_${columnNumber}`)
  }

  for (let i = 0; i < numOfColumns; i++) {
    // Generate zero-padded column number
    const columnNumber = zeroPad(i, 2) // Change 2 to the maximum number of digits you expect
    columns.push(`next_${columnNumber}`)
  }

  // Now, 'columns' contains your headers like ["current_00", "current_01", ..., "next_00", "next_01", ...]
  // You can prepend this to your CSV content
  const columnHeaders = columns.join(',') + '\n' // Convert the array of headers into a single CSV header row
  const csvWithHeaders = columnHeaders + csvContent // Prepend the headers to the original CSV content

  // The rest of your code to generate the Blob and trigger the download remains the same

  const blob = new Blob([csvWithHeaders], { type: 'text/csv;charset=utf-8;' })

  // Create a link element, hide it, direct it towards the blob, and then 'click' it programmatically
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'game_of_life_data.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function conwaysGameOfLifeControlPanel(GOL: GameOfLife) {
  // *** Add control panel ***
  const cP = document.getElementById('control-panel')
  if (cP) {
    // Update button
    const iButton = document.getElementById('update-button')
    if (iButton) {
      iButton.onclick = () => {
        GOL.update()
        GOL.renderer.thingsToDraw = GOL.cells
      }
    }
    // Cells number range
    // !TODO: unfinished
    const iRange = document.getElementById('cells-number-range')
    if (iRange) {
      iRange.oninput = (event) => {
        const sliderValue = document.getElementById('sliderValue')
        if (sliderValue) {
          sliderValue.textContent = (event.target as HTMLInputElement).value
        }
      }
    }
  }
}

class GameOfLife {
  cells: Cell[] = []
  renderer: Renderer

  private numberOfCells = 100

  constructor(renderer: Renderer) {
    this.renderer = renderer
    for (let i = 0; i < this.numberOfCells; i++) {
      for (let j = 0; j < this.numberOfCells; j++) {
        this.cells[i * this.numberOfCells + j] = new Cell(false, { x: j * Cell.width, y: i * Cell.height })
      }
    }

    conwaysGameOfLifeControlPanel(this)

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
        for (const cell of GOL.cells) {
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
      for (const cell of GOL.cells) {
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
      x: cellNumber % this.numberOfCells,
      y: Math.floor(cellNumber / this.numberOfCells),
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
      if (newX >= 0 && newX < this.numberOfCells && newY >= 0 && newY < this.numberOfCells) {
        neighbors.push(newY * this.numberOfCells + newX)
      }
    }

    return neighbors
  }

  update() {
    this.renderer.newSize = { w: Math.sqrt(this.cells.length) * Cell.width, h: Math.sqrt(this.cells.length) * Cell.height }

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

    // genCSV(twoFramesArray(this.cells, nextState))
    // Swap cells with nextState for the next tick
    this.cells = nextState
  }

  start() {
    this.renderer.addThingsToDraw(this.cells)
    this.renderer.start()
  }
}

const GOL = new GameOfLife(new Renderer())
// Init canvas size
GOL.renderer.newSize = { w: Math.sqrt(GOL.cells.length) * Cell.width, h: Math.sqrt(GOL.cells.length) * Cell.height }
GOL.start()

const u = () => {
  setTimeout(() => {
    GOL.update()
    GOL.renderer.thingsToDraw = GOL.cells
    u()
  }, 1000)
}
// u()

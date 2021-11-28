const canvasContainer = document.getElementById('canvas-container')
const canvas = <HTMLCanvasElement>document.createElement('canvas')
canvas.width = canvasContainer.offsetWidth - 2
canvas.height = canvasContainer.offsetHeight - 2
canvasContainer.appendChild(canvas)
const speedRange = <HTMLInputElement>document.querySelector('#cellular-automate-controls-sliders-speed-input')
const ctx = canvas.getContext('2d')

const CELL_WIDTH = 20
const CELL_HEIGHT = CELL_WIDTH

class Cell {
  // Cell properties
  x: number
  y: number
  alive: boolean

  constructor(x: number, y: number, alive: boolean) {
    this.x = x
    this.y = y
    this.alive = alive
  }
}

const allCellAliveStatesCombinationsByThree = [
  [false, false, false],
  [false, false, true],
  [false, true, false],
  [false, true, true],
  [true, false, false],
  [true, false, true],
  [true, true, false],
  [true, true, true],
]

const cells = async () => {
  let x = 0
  for (let i = 0; i < allCellAliveStatesCombinationsByThree.length; i++) {
    for (let j = 0; j < allCellAliveStatesCombinationsByThree[i].length; j++) {
      // Draw all cells vertically

      let separator = 0
      // Separator between cells sets
      console.log(i, j)

      if (j === 2) {
        separator = (canvas.width - allCellAliveStatesCombinationsByThree.length * CELL_WIDTH * 3) / (allCellAliveStatesCombinationsByThree.length - 1)
      }

      ctx.fillStyle = allCellAliveStatesCombinationsByThree[i][j] ? 'black' : 'white'
      // Spread the cells horizontally
      ctx.fillRect(x, 1, CELL_WIDTH - 1, CELL_HEIGHT - 1)
      x = x + CELL_WIDTH + separator
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

cells()

// Draw rectangle
// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, CELL_WIDTH, CELL_HEIGHT);
// ctx.strokeStyle = "black";
// ctx.strokeRect(20, 0, CELL_WIDTH, CELL_HEIGHT);
// ctx.strokeRect(20, 20, CELL_WIDTH, CELL_HEIGHT);

function drawFrame() {
  // setTimeout(function () {
  //   requestAnimationFrame(() => drawFrame());
  //   // animating/drawing code goes here
  // }, 1000 / parseInt(speedRange.value));
}
drawFrame()

export {}

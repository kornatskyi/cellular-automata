import './styles/index.scss'
import { Cell, PCell } from './classes/Cell'
import { Renderer } from './classes/Renderer'
import { Rule } from './classes/Rule'
import { Position } from './types/global'

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}

class CellMap {
  private cellsMap: Map<string, Cell>

  constructor() {
    this.cellsMap = new Map<string, Cell>()
  }
  set(key: Position, value: Cell) {
    this.cellsMap.set(`${key.x},${key.y}`, value)
  }

  get(key: string) {
    return this.cellsMap.get(key)
  }

  getByPosition(position: Position) {
    return this.cellsMap.get(`${position.x},${position.y}`)
  }

  get cells(): Cell[] {
    return [...this.cellsMap.values()]
  }

  add(cell: Cell) {
    this.set(cell.position, cell)
  }

  addMany(cells: Cell[]) {
    for (const cell of cells) {
      this.set(cell.position, cell)
    }
  }
}

class Player {
  cellMap: CellMap
  rule: Rule
  name: string
  playerId: string
  color: string
  constructor(name: string, rule: Rule, playerId: string, color: string) {
    this.name = name
    this.rule = rule
    this.playerId = playerId
    this.color = color
    this.cellMap = new CellMap()
  }

  getCellsByRowNumberMap(): Map<number, Cell[]> {
    const cellsByRowNumber = new Map<number, Cell[]>()
    for (const c of this.cellMap.cells) {
      if (cellsByRowNumber.get(c.position.y)) {
        cellsByRowNumber.get(c.position.y)?.push(c)
      } else {
        cellsByRowNumber.set(c.position.y, [c])
      }
    }
    return cellsByRowNumber
  }

  calculateNextState(): Cell[] {
    const cellsByRowNumber = this.getCellsByRowNumberMap()
    const newCells = [this.cellMap.cells[0]]

    for (const rowNumber of cellsByRowNumber.keys()) {
      const currentRow = cellsByRowNumber.get(rowNumber) ?? []
      const isFirstOnTheNextRowAlive = this.rule.result([false, false, currentRow[0].alive])
      const nextRow = isFirstOnTheNextRowAlive ? [new PCell(isFirstOnTheNextRowAlive, { x: currentRow[0].position.x - Cell.width, y: currentRow[0].position.y + Cell.height }, this.playerId, this.color)] : []

      for (let i = 0; i < currentRow.length; i++) {
        const isLeftAlive = currentRow[i - 1]?.alive ?? false
        const isMiddleAlive = currentRow[i].alive
        const isRightAlive = currentRow[i + 1]?.alive ?? false
        let isNexCellAlive = this.rule.result([isLeftAlive, isMiddleAlive, isRightAlive])

        if (!isNexCellAlive) {
          isNexCellAlive = false
        }

        const newCell = new PCell(isNexCellAlive, { x: currentRow[i].position.x, y: currentRow[i].position.y + Cell.height }, this.playerId, this.color)
        newCell.color = this.color
        nextRow.push(newCell)
      }
      nextRow.push(new PCell(this.rule.result([currentRow[currentRow.length - 1].alive, false, false]), { x: currentRow[currentRow.length - 1].position.x + Cell.width, y: currentRow[currentRow.length - 1].position.y + Cell.height }, this.playerId, this.color))
      newCells.push(...nextRow)
    }
    return newCells
  }
}

class GameOfLife {
  cellMap = new CellMap()
  renderer: Renderer

  player1: Player
  player2: Player

  private n = 51
  constructor(renderer: Renderer, player1: Player, player2: Player) {
    this.renderer = renderer
    this.player1 = player1
    this.player2 = player2
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        this.cellMap.add(new Cell(false, { x: j * Cell.width, y: i * Cell.height }))
      }
    }

    const p1CenterCell = new PCell(true, { x: Math.floor(this.n / 2) * Cell.width, y: 0 }, player1.playerId, player1.color)
    p1CenterCell.color = this.player1.color
    player1.cellMap.add(p1CenterCell)
    const p2CenterCell = new PCell(true, { x: Math.floor(this.n / 2) * Cell.width, y: (this.n - 1) * Cell.height }, player2.playerId, player2.color)
    p2CenterCell.color = this.player2.color
    player2.cellMap.add(p2CenterCell)

    // *** Add control panel ***
    const cP = document.getElementById('control-panel')
    if (cP) {
      const iButton = cP.appendChild(document.createElement('button'))
      iButton.textContent = 'Next turn'
      iButton.onclick = () => {
        GOF.nextTurn()
        GOF.update()
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
        for (const cell of [...GOF.cellMap.cells, ...player1.cellMap.cells, ...player2.cellMap.cells]) {
          // Check if the click was inside this cell
          if (x >= cell.position.x && x < cell.position.x + Cell.width && y >= cell.position.y && y < cell.position.y + Cell.height) {
            // Click was inside this cell, toggle its state
            this.cellMap.add(new Cell(true, { x: cell.position.x, y: cell.position.y }))
            this.update()
            // cell.onClick()
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
      for (const cell of [...GOF.cellMap.cells, ...player1.cellMap.cells, ...player2.cellMap.cells]) {
        // Check if the click was inside this cell
        if (x >= cell.position.x && x < cell.position.x + Cell.width && y >= cell.position.y && y < cell.position.y + Cell.height) {
          // Click was inside this cell, toggle its state
          this.cellMap.add(new Cell(true, { x: cell.position.x, y: cell.position.y }))
          this.update()
          break
        }
      }
    })
  }

  nextTurn() {
    this.player1.cellMap.addMany(this.player1.calculateNextState())
    this.player2.cellMap.addMany(this.player2.calculateNextState())
  }
  update() {
    this.cellMap.addMany(this.player1.cellMap.cells)
    this.cellMap.addMany(this.player2.cellMap.cells)
    this.renderer.thingsToDraw = [...this.cellMap.cells]
  }

  start() {
    this.renderer.addThingsToDraw([...this.cellMap.cells, ...this.player1.cellMap.cells, ...this.player2.cellMap.cells])
    this.renderer.start()
  }
}

const p1Rule = Rule.getRuleByNumber(30)
const player1 = new Player('Top', p1Rule, 'Top1', 'blue')
const p2Rule = Rule.getRuleByNumber(2)
const player2 = new Player('Bottom', p2Rule, 'Bottom', 'red')

const GOF = new GameOfLife(new Renderer(), player1, player2)

GOF.start()

// const u = () => {
//   setTimeout(() => {
//     GOF.update()
//     GOF.renderer.thingsToDraw = GOF.cells
//     u()
//   }, 10)
// }
// u()

import { DrawElement } from '../interfaces/Rendering'
import { Position } from '../types/global'
import { Cell } from './Cell'
import { Rule } from './Rule'

const CELL_WIDTH = 20

export class ElementaryCellularAutomata implements DrawElement {
  cells: Cell[][]
  rule: Rule
  initialPosition: Position = { x: 100, y: 400 }
  generation = 0

  constructor() {
    this.rule = new Rule(false, true, true, true, true, false, false, false)
    this.cells = [
      [
        new Cell(false, {
          x: this.initialPosition.x - CELL_WIDTH,
          y: this.initialPosition.y,
        }),
        new Cell(true, this.initialPosition),
        new Cell(false, { x: this.initialPosition.x + CELL_WIDTH, y: this.initialPosition.y }),
      ],
    ]
  }
  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].draw(ctx)
      }
    }
    if (this.generation < 1000) {
      const middleCells: Cell[] = []

      for (let i = 0; i < this.cells[this.generation].length - 2; i++) {
        const cells = this.cells[this.generation]
        middleCells.push(this.calculateNextCell(cells[i], cells[i + 1], cells[i + 2]))
      }

      const newGeneration = [
        new Cell(false, {
          x: this.initialPosition.x - CELL_WIDTH * (this.generation + 1) - CELL_WIDTH,
          y: this.initialPosition.y + CELL_WIDTH * (this.generation + 1),
        }),
        new Cell(false, {
          x: this.initialPosition.x - CELL_WIDTH * (this.generation + 1),
          y: this.initialPosition.y + CELL_WIDTH * (this.generation + 1),
        }),

        ...middleCells,
        new Cell(false, {
          x: this.initialPosition.x + CELL_WIDTH * (this.generation + 1),
          y: this.initialPosition.y + CELL_WIDTH * (this.generation + 1),
        }),
        new Cell(false, {
          x: this.initialPosition.x + CELL_WIDTH * (this.generation + 1) + CELL_WIDTH,
          y: this.initialPosition.y + CELL_WIDTH * (this.generation + 1),
        }),
      ]

      this.cells.push(newGeneration)

      this.generation++
    }
  }

  calculateNextCell(left: Cell, middle: Cell, right: Cell): Cell {
    const resultCell = new Cell(this.rule.result([left.color, middle.color, right.color]), {
      x: middle.position.x,
      y: middle.position.y + middle.height,
    })

    return resultCell
  }
}

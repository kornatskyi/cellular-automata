import { DrawElement } from '../interfaces/Rendering'
import { Position } from '../types/global'
import { Cell } from './Cell'
import { Rule } from './Rule'

const CELL_WIDTH = 20

export class ElementaryCellularAutomata implements DrawElement {
  cells: Cell[][]
  rule: Rule = new Rule(true, true, true, true, true, true, true, true)
  initialPosition: Position = { x: 800, y: 20 }
  generation = 0
  interval: NodeJS.Timer

  generationRate = 1000 / 60
  maxNumberOfGeneration = 10

  constructor(rule?: Rule) {
    this.initAutomaton(rule)
  }

  initAutomaton(rule?: Rule) {
    this.rule = rule ?? this.rule

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

  setRule(rule: Rule) {
    this.rule = rule
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Rendering elements on the regular rendering speed
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].draw(ctx)
      }
    }
  }

  stopAutomaton() {
    clearInterval(this.interval)
  }

  resetAutomaton(rule = this.rule) {
    this.initAutomaton(rule)
    this.generation = 0
    clearInterval(this.interval)
  }

  startAutomaton() {
    this.generate()

    this.interval = setInterval(
      (() => {
        this.generate()
      }).bind(this),
      1000 / 60
    )
  }

  generate() {
    // When making calculation of new cell generation using timeout to slow down generation rate
    if (this.generation < 10000) {
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
      console.log(newGeneration);
      
      this.cells.push(newGeneration)
      this.generation++
    }
  }

  calculateNextCell(left: Cell, middle: Cell, right: Cell): Cell {
    const resultCell = new Cell(this.rule.result([left.alive, middle.alive, right.alive]), {
      x: middle.position.x,
      y: middle.position.y + Cell.height,
    })

    return resultCell
  }
}

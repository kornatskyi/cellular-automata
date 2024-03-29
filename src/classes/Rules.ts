import { COMBINATIONS_OF_THREE_CELLS } from '../constants'
import '../index'
import { DrawElement } from '../interfaces/Rendering'

export default class Rules implements DrawElement {
  ctx: CanvasRenderingContext2D
  private CELL_WIDTH = 20
  private CELL_HEIGHT = 20
  private WIDTH = 700

  private allBinaryCombinationOfLength(length: number) {
    const result = []
    for (let i = 0; i < Math.pow(2, length); i++) {
      const binary = i.toString(2)
      const paddedBinary = '0'.repeat(length - binary.length) + binary
      result.push(paddedBinary.split('').map(Number))
    }
    return result
  }

  public draw(ctx: CanvasRenderingContext2D) {
    let x = 0
    for (let i = 0; i < COMBINATIONS_OF_THREE_CELLS.length; i++) {
      for (let j = 0; j < COMBINATIONS_OF_THREE_CELLS[i].length; j++) {
        // Separator between cells sets
        let separator = 0
        if (j === 2) {
          separator = (this.WIDTH - COMBINATIONS_OF_THREE_CELLS.length * this.CELL_WIDTH * 3) / (COMBINATIONS_OF_THREE_CELLS.length - 1)
        }

        ctx.fillStyle = COMBINATIONS_OF_THREE_CELLS[i][j] ? 'black' : 'white'
        // Spread the cells horizontally
        ctx.fillRect(x, 1, this.CELL_WIDTH - 1, this.CELL_HEIGHT - 1)
        x = x + this.CELL_WIDTH + separator
        // await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    const allPossibleRules = this.allBinaryCombinationOfLength(COMBINATIONS_OF_THREE_CELLS.length)

    x = 0

    for (let i = 0; i < allPossibleRules.length; i++) {
      x = this.CELL_WIDTH
      for (let j = 0; j < allPossibleRules[i].length; j++) {
        ctx.fillStyle = allPossibleRules[i][j] !== 0 ? 'black' : 'white'
        const separator = (this.WIDTH - 3 * this.CELL_WIDTH) / 7
        // Spread the cells horizontally
        ctx.fillRect(x, i * this.CELL_HEIGHT + this.CELL_HEIGHT * 2, this.CELL_WIDTH - 1, this.CELL_HEIGHT - 1)
        x = x + separator
      }
    }
  }
}

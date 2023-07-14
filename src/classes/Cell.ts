import { DrawElement } from '../interfaces/Rendering'
import { Position } from '../types/global'

export class Cell implements DrawElement {
  static width = 20
  static height = 20
  color: boolean
  position: Position

  constructor(color: boolean, position: Position) {
    this.color = color
    this.position = position
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Fill color
    ctx.fillStyle = this.color ? 'black' : 'white'
    ctx.fillRect(this.position.x, this.position.y, Cell.width, Cell.height)

    // Border color opposite to fill color
    ctx.strokeStyle = this.color ? 'white' : 'black'
    ctx.strokeRect(this.position.x, this.position.y, Cell.width, Cell.height)
  }

  setPosition(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
  }
}

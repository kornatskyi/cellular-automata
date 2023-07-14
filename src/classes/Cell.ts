import { DrawElement } from '../interfaces/Rendering'
import { Position } from '../types/global'

export class Cell implements DrawElement {
  static width = 20
  static height = 20
  alive: boolean
  position: Position

  constructor(color: boolean, position: Position) {
    this.alive = color
    this.position = position
  }

  onClick(): void {
    this.alive = !this.alive
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Fill color
    ctx.fillStyle = this.alive ? 'black' : 'white'
    ctx.fillRect(this.position.x, this.position.y, Cell.width, Cell.height)

    // Border color opposite to fill color
    ctx.strokeStyle = this.alive ? 'white' : 'black'
    ctx.strokeRect(this.position.x, this.position.y, Cell.width, Cell.height)
  }

  setPosition(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
  }
}

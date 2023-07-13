import { DrawElement } from '../interfaces/Rendering'
import { Position } from '../types/global'

export class Cell implements DrawElement {
  width: number
  height: number
  color: boolean
  position: Position

  constructor(color: boolean, position: Position) {
    this.width = 20
    this.height = 20
    this.color = color
    this.position = position
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color ? 'black' : 'white'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  setPosition(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
  }
}

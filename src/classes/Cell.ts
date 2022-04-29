import { DrawElement } from '../interfaces/Rendering'

type Position = {
  x: number
  y: number
}

export class Cell implements DrawElement {
  width: number
  height: number
  color: string
  position: Position

  constructor() {
    this.width = 40
    this.height = 40
    this.color = 'green'
    this.position = { x: 100, y: 100 }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // ctx.translate(this.position.x, this.position.y)
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

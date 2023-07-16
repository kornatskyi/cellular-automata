import { Position } from './../types/global'
import { DrawElement } from '../interfaces/Rendering'

// export interface ICell {
//   alive: boolean
//   position: Position
//   color: string
//   onClick: () => void
//   setPosition: (position: Position) => void
// }
export class Cell implements DrawElement {
  static width = 20
  static height = 20
  alive: boolean
  position: Position
  color = 'white'

  constructor(alive: boolean, position: Position) {
    this.alive = alive
    this.position = position
  }

  onClick(): void {
    this.alive = true
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
  get i() {
    return this.position.x / Cell.width
  }
  set i(iPosition: number) {
    this.position.x = Math.floor(iPosition) * Cell.width
  }
  get j() {
    return this.position.y / Cell.width
  }
  set j(jPosition: number) {
    this.position.y = Math.floor(jPosition) * Cell.height
  }
}

export class PCell extends Cell{
  playerId: string
  constructor(alive: boolean, position: Position, playerId: string, color: string) {
    super(alive, position)
    this.playerId = playerId
    this.color = color
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Fill color
    ctx.fillStyle = this.alive ? this.color : 'white'
    ctx.fillRect(this.position.x, this.position.y, Cell.width, Cell.height)

    // Border color opposite to fill color
    ctx.strokeStyle = this.alive ? 'white' : 'black'
    ctx.strokeRect(this.position.x, this.position.y, Cell.width, Cell.height)
  }
}

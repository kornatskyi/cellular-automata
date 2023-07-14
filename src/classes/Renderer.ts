import { DrawElement } from '../interfaces/Rendering'

export enum RenderingState {
  START,
  STOP,
  RESTART,
}

export class Renderer {
  fps = 60
  thingsToDraw: DrawElement[] = []
  canvas: HTMLCanvasElement
  canvasContainer: HTMLElement
  ctx: CanvasRenderingContext2D

  private renderingState = RenderingState.STOP

  getRenderingState() {
    return this.renderingState
  }

  constructor() {
    // This element will be used as a container for canvas
    this.canvasContainer =
      document.getElementById('canvas-container') ??
      (() => {
        throw new Error('No canvas container in DOM!')
      })()

    // Creating canvas
    this.canvas = <HTMLCanvasElement>document.createElement('canvas')

    // Setting canvas size depending on parent container size
    this.canvas.width = this.canvasContainer.offsetWidth
    this.canvas.height = this.canvasContainer.offsetHeight

    // Inserting canvas into container
    this.canvasContainer.appendChild(this.canvas)

    this.ctx =
      this.canvas.getContext('2d') ??
      (() => {
        throw new Error('Unable to get canvas context!')
      })()
  }

  addThingsToDraw(thingsToDraw: DrawElement[]): void {
    this.thingsToDraw.push(...thingsToDraw)
  }

  clearDrawingList(): void {
    this.thingsToDraw = []
  }

  restart(): void {
    this.clearDrawingList()
    this.renderingState = RenderingState.RESTART
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  stop(): void {
    this.renderingState = RenderingState.STOP
  }

  start(): void {
    // Ready, set, go
    this.renderingState = RenderingState.START
    this.render()
  }

  // Recursive function which is responsible for rendering all DrawElements to canvas
  render() {
    if (this.renderingState === RenderingState.START) {
      this.canvas.width = this.canvasContainer.offsetWidth
      this.canvas.height = this.canvasContainer.offsetHeight

      this.thingsToDraw?.forEach((element) => {
        element.draw(this.ctx)
      })
      // console.log('draw')

      // need to bind callback function to this instance
      setTimeout(
        function () {
          requestAnimationFrame(() => this.render())
        }.bind(this),
        1000 / (this.fps || 1)
      )
    } else if (this.renderingState === RenderingState.RESTART) {
      return
    }
  }
}

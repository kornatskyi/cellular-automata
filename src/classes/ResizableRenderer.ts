import { Position } from '../types/global'
import { getEventLocation } from '../utils/cursorCoordinates'
import { Renderer, RenderingState } from './Renderer'

class Transformation {
  scale = 1
  translation = { x: 0, y: 0 }
  constructor(scale?: number, translation?: { x: number; y: number }) {
    this.scale = scale ?? this.scale
    this.translation = translation ?? this.translation
  }

  transform(point: Position): Position {
    return {
      x: point.x * this.scale + this.translation.x,
      y: point.y * this.scale + this.translation.y,
    }
  }
}

export class ResizableRenderer extends Renderer {
  private cameraOffset: Position
  private cameraZoom = 1
  private MAX_ZOOM = 1
  private MIN_ZOOM = 0.07
  private SCROLL_SENSITIVITY = 0.0003

  private transformation = new Transformation()

  private isDragging = false
  private dragStart: Position = { x: 0, y: 0 }

  private initialPinchDistance: number | null = null
  private lastZoom: number

  private cursorPosition: Position = { x: 0, y: 0 }

  constructor() {
    super()

    this.cameraOffset = {
      x: this.canvasContainer.offsetWidth / 2,
      y: this.canvasContainer.offsetHeight / 2,
    }

    this.lastZoom = this.cameraZoom

    const onPointerDown = (e: TouchEvent | MouseEvent) => {
      this.isDragging = true
      this.dragStart.x = getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x
      this.dragStart.y = getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y
    }

    const onPointerMove = (e: TouchEvent | MouseEvent) => {
      if (this.isDragging) {
        this.cameraOffset.x = getEventLocation(e).x / this.cameraZoom - this.dragStart.x
        this.cameraOffset.y = getEventLocation(e).y / this.cameraZoom - this.dragStart.y
      }
    }

    const onPointerUp = () => {
      this.isDragging = false
      this.initialPinchDistance = null
      this.lastZoom = this.cameraZoom
    }

    const handleTouch = (e: TouchEvent, singleTouchHandler: (e: TouchEvent) => void) => {
      if (e.touches.length == 1) {
        singleTouchHandler(e)
      } else if (e.type == 'touchmove' && e.touches.length == 2) {
        this.isDragging = false
        handlePinch(e)
      }
    }

    const handlePinch = (e: TouchEvent) => {
      e.preventDefault()

      const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      const currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

      if (this.initialPinchDistance == null) {
        this.initialPinchDistance = currentDistance
      } else {
        adjustZoom(null, currentDistance / this.initialPinchDistance)
      }
    }

    const adjustZoom = (zoomAmount: number | null, zoomFactor: number | null) => {
      if (!this.isDragging) {
        if (zoomAmount) {
          this.cameraZoom += zoomAmount
        } else if (zoomFactor) {
          console.log(zoomFactor)
          this.cameraZoom = zoomFactor * this.lastZoom
        }
        this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
        this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)
      }
    }

    this.canvas.addEventListener('mousedown', onPointerDown)
    this.canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
    this.canvas.addEventListener('mouseup', onPointerUp)
    this.canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
    this.canvas.addEventListener('mousemove', onPointerMove)
    this.canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
    this.canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY, null))
    this.canvas.addEventListener('mousemove', this.updateCursorPosition.bind(this))
  }

  render() {
    if (this.getRenderingState() === RenderingState.START) {
      this.canvas.width = this.canvasContainer.offsetWidth
      this.canvas.height = this.canvasContainer.offsetHeight
      this.ctx.scale(this.cameraZoom, this.cameraZoom)
      this.ctx.translate(-this.canvasContainer.offsetWidth / 2 + this.cameraOffset.x, -this.canvasContainer.offsetHeight / 2 + this.cameraOffset.y)
      this.ctx.clearRect(0, 0, this.canvasContainer.offsetWidth, this.canvasContainer.offsetHeight)
      this.thingsToDraw?.forEach((element) => {
        element.draw(this.ctx)
      })
      // console.log('draw')
      /** Need refactor */
      this.ctx.restore() // Restore original context's state

      this.ctx.save() // Save current context's state again

      // Reset transformation matrix before drawing static UI element
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.fillText('Zoom:', 10, 20) // Drawing the text in top-left corner
      this.ctx.fillText(`Pointer coordinates x: ${this.cursorPosition.x}, y: ${this.cursorPosition.y}`, 10, 40) // Drawing the text in top-left corner
      this.ctx.restore() // Restore context's state to what it was before drawing static UI element

      // need to bind callback function to this instance
      setTimeout(
        function () {
          requestAnimationFrame(() => this.render())
        }.bind(this),
        1000 / (this.fps || 1)
      )
    } else if (this.getRenderingState() === RenderingState.RESTART) {
      return
    }
  }

  updateCursorPosition(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    this.cursorPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }
}

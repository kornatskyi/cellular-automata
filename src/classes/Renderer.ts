import { DrawElement } from '../interfaces/Rendering'

export class Renderer {
  static isRendering = false
  static thingsToDraw: DrawElement[]

  static start() {
    if (!Renderer.isRendering) {
      // Make render function singletons
      Renderer.isRendering = true

      const canvasContainer = document.getElementById('canvas-container')
      const canvas = <HTMLCanvasElement>document.createElement('canvas')
      canvas.id = 'canvas'

      canvas.width = canvasContainer.offsetWidth
      canvas.height = canvasContainer.offsetHeight

      canvasContainer.appendChild(canvas)
      const ctx = canvas.getContext('2d')

      // asyncFunction()

      let cameraOffset = { x: canvasContainer.offsetWidth / 2, y: canvasContainer.offsetHeight / 2 }
      let cameraZoom = 1
      let MAX_ZOOM = 5
      let MIN_ZOOM = 0.07
      let SCROLL_SENSITIVITY = 0.0005

      function render() {
        canvas.width = canvasContainer.offsetWidth
        canvas.height = canvasContainer.offsetHeight
        // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
        // ctx.translate(cursorPosition.x / 2, cursorPosition.y / 2)
        ctx.scale(cameraZoom, cameraZoom)
        ctx.translate(-canvasContainer.offsetWidth / 2 + cameraOffset.x, -canvasContainer.offsetHeight / 2 + cameraOffset.y)
        ctx.clearRect(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight)

        Renderer.thingsToDraw.forEach((element) => {
          element.draw(ctx)
        })
        console.log('draw')

        // setTimeout(function () {
        requestAnimationFrame(() => render())
        // animating/drawing code goes here
        // }, 1000 / parseInt(speedRange.value))
      }

      // Gets the relevant location from a mouse or single touch event
      function getEventLocation(e: any) {
        if (e.touches && e.touches.length == 1) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        } else if (e.clientX && e.clientY) {
          return { x: e.clientX, y: e.clientY }
        }
      }

      let isDragging = false
      let dragStart = { x: 0, y: 0 }

      function onPointerDown(e: Event) {
        isDragging = true
        dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x
        dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y
      }

      function onPointerUp(e: Event) {
        isDragging = false
        initialPinchDistance = null
        lastZoom = cameraZoom
      }

      function onPointerMove(e: Event) {
        if (isDragging) {
          cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
          cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
        }
      }

      function handleTouch(e: TouchEvent, singleTouchHandler: (e: TouchEvent) => void) {
        if (e.touches.length == 1) {
          singleTouchHandler(e)
        } else if (e.type == 'touchmove' && e.touches.length == 2) {
          isDragging = false
          handlePinch(e)
        }
      }

      let initialPinchDistance: any = null
      let lastZoom = cameraZoom

      function handlePinch(e: TouchEvent) {
        e.preventDefault()

        let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (initialPinchDistance == null) {
          initialPinchDistance = currentDistance
        } else {
          adjustZoom(null, currentDistance / initialPinchDistance)
        }
      }

      function adjustZoom(zoomAmount: number, zoomFactor: number) {
        if (!isDragging) {
          if (zoomAmount) {
            cameraZoom += zoomAmount
          } else if (zoomFactor) {
            console.log(zoomFactor)
            cameraZoom = zoomFactor * lastZoom
          }
          cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
          cameraZoom = Math.max(cameraZoom, MIN_ZOOM)
        }
      }

      canvas.addEventListener('mousedown', onPointerDown)
      canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
      canvas.addEventListener('mouseup', onPointerUp)
      canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
      canvas.addEventListener('mousemove', onPointerMove)
      canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
      canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY, null))

      // Ready, set, go

      render()
    } else {
      console.log('Already rendering!')
    }
  }
}

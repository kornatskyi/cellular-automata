import '../../index'

import { cursorCoordinates } from '../../utils/cursorCoordinates'
const canvasContainer = document.getElementById('canvas-container')
const canvas = <HTMLCanvasElement>document.createElement('canvas')
canvas.id = 'canvas'
const CANVAS_RIGHT_PADDING = 4
const CANVAS_BOTTOM_PADDING = 4

canvas.width = canvasContainer.offsetWidth - CANVAS_RIGHT_PADDING
canvas.height = canvasContainer.offsetHeight - CANVAS_BOTTOM_PADDING

canvasContainer.appendChild(canvas)
const speedRange = <HTMLInputElement>document.querySelector('#cellular-automate-controls-sliders-speed-input')
const ctx = canvas.getContext('2d')

const CELL_WIDTH = 20
const CELL_HEIGHT = CELL_WIDTH

class Cell {
  // Cell properties
  x: number
  y: number
  alive: boolean

  constructor(x: number, y: number, alive: boolean) {
    this.x = x
    this.y = y
    this.alive = alive
  }
}

const allCellAliveStatesCombinationsByThree = [
  [false, false, false],
  [false, false, true],
  [false, true, false],
  [false, true, true],
  [true, false, false],
  [true, false, true],
  [true, true, false],
  [true, true, true],
]

const allBinaryCombinationOfLength = (length: number) => {
  const result = []
  for (let i = 0; i < Math.pow(2, length); i++) {
    const binary = i.toString(2)
    const paddedBinary = '0'.repeat(length - binary.length) + binary
    result.push(paddedBinary.split('').map(Number))
  }
  return result
}

const asyncFunction = async () => {
  let x = 0
  for (let i = 0; i < allCellAliveStatesCombinationsByThree.length; i++) {
    for (let j = 0; j < allCellAliveStatesCombinationsByThree[i].length; j++) {
      // Separator between cells sets
      let separator = 0
      if (j === 2) {
        separator = (canvas.width - allCellAliveStatesCombinationsByThree.length * CELL_WIDTH * 3) / (allCellAliveStatesCombinationsByThree.length - 1)
      }

      ctx.fillStyle = allCellAliveStatesCombinationsByThree[i][j] ? 'black' : 'white'
      // Spread the cells horizontally
      ctx.fillRect(x, 1, CELL_WIDTH - 1, CELL_HEIGHT - 1)
      x = x + CELL_WIDTH + separator
      // await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  const allPossibleRules = allBinaryCombinationOfLength(allCellAliveStatesCombinationsByThree.length)
  x = 0
  for (let i = 0; i < allPossibleRules.length; i++) {
    x = CELL_WIDTH
    for (let j = 0; j < allPossibleRules[i].length; j++) {
      ctx.fillStyle = allPossibleRules[i][j] ? 'black' : 'white'
      let separator = (canvas.width - 3 * CELL_WIDTH) / 7
      // Spread the cells horizontally
      ctx.fillRect(x, i * CELL_HEIGHT + CELL_HEIGHT * 2, CELL_WIDTH - 1, CELL_HEIGHT - 1)
      x = x + separator
    }
  }
}
// asyncFunction()

let cameraOffset = { x: canvasContainer.offsetWidth / 2, y: canvasContainer.offsetHeight / 2 }
let cameraZoom = 1
let MAX_ZOOM = 5
let MIN_ZOOM = 0.07
let SCROLL_SENSITIVITY = 0.0005

function draw() {
  canvas.width = canvasContainer.offsetWidth - CANVAS_RIGHT_PADDING
  canvas.height = canvasContainer.offsetHeight - CANVAS_BOTTOM_PADDING
  // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
  // ctx.translate(cursorPosition.x / 2, cursorPosition.y / 2)
  ctx.scale(cameraZoom, cameraZoom)
  ctx.translate(-canvasContainer.offsetWidth / 2 + cameraOffset.x, -canvasContainer.offsetHeight / 2 + cameraOffset.y)
  ctx.clearRect(0, 0, canvasContainer.offsetWidth, canvasContainer.offsetHeight)

  asyncFunction()
  console.log('draw')

  // setTimeout(function () {
  requestAnimationFrame(() => draw())
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

draw()

const image = canvas.toDataURL('image/png', 1.0)

const link = document.getElementsByClassName('download-image')[0] as HTMLAnchorElement
link.href = image

// // Draw rectangle
// // ctx.fillStyle = "black";
// // ctx.fillRect(0, 0, CELL_WIDTH, CELL_HEIGHT);
// // ctx.strokeStyle = "black";
// // ctx.strokeRect(20, 0, CELL_WIDTH, CELL_HEIGHT);
// // ctx.strokeRect(20, 20, CELL_WIDTH, CELL_HEIGHT);

// // function drawFrame() {
// //   const p1 = ctx.transformedPoint(0, 0)
// //   const p2 = ctx.transformedPoint(canvas.width, canvas.height)
// //   console.log(p1, p2)

// //   ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)

// //   // ctx.fillStyle = 'black'
// //   // ctx.fillRect(0, 0, 40, 40)
// //   setTimeout(function () {
// //     requestAnimationFrame(() => drawFrame())
// //     // animating/drawing code goes here
// //   }, 1000 / parseInt(speedRange.value))
// // }
// // drawFrame()

// export {}

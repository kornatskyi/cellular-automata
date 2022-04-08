import '../../index'

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

const header = document.querySelector('header')

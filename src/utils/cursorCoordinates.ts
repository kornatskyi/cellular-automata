// console.log(document.getElementById('canvas-container'))

document.getElementById('canvas-container').addEventListener('mousemove', (e) => {
  cursor.setInputValue('x', e.offsetX)
  cursor.setInputValue('y', e.offsetY)
})

class Cursor {
  coordinates: { x: number; y: number }

  constructor() {
    this.coordinates = { x: 0, y: 0 }
  }

  setInputValue = function (name: any, val: any) {
    this.coordinates[name] = val
  }

  getInputValue = function (n: any) {
    return this.coordinates[n]
  }
}

const cursor = new Cursor()

export function cursorCoordinates() {
  return cursor.coordinates
}
export {}

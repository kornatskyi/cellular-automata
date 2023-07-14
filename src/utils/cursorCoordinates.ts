import { Position } from "../types/global";

document.getElementById("canvas-container")?.addEventListener("mousemove", (e) => {
	cursor.setInputValue("x", e.offsetX);
	cursor.setInputValue("y", e.offsetY);
});

class Cursor {
	coordinates: { x: number; y: number };

	constructor() {
		this.coordinates = { x: 0, y: 0 };
	}

	setInputValue = function (name: string, val: number) {
		this.coordinates[name] = val;
	};

	getInputValue = function (n: number) {
		return this.coordinates[n];
	};
}

const cursor = new Cursor();

export function cursorCoordinates() {
	return cursor.coordinates;
}

export const getEventLocation = (e: TouchEvent | MouseEvent): Position => {
  if (e instanceof TouchEvent) {
    if (e.touches && e.touches.length == 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }
  if (e instanceof MouseEvent) {
    if (e.clientX && e.clientY) {
      return { x: e.clientX, y: e.clientY }
    }
  }

  throw new Error('Wrong event! in getEventLocation(e: TouchEvent | MouseEvent) method')
}


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

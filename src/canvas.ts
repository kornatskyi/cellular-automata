const canvasContainer = document.getElementById("canvas-container");
const canvas = <HTMLCanvasElement>document.createElement("canvas");
canvas.width = canvasContainer.offsetWidth - 2;
canvas.height = canvasContainer.offsetHeight - 2;
canvasContainer.appendChild(canvas);
const speedRange = <HTMLInputElement>(
  document.querySelector("#cellular-automate-controls-sliders-speed-input")
);

const ctx = canvas.getContext("2d");

function drawFrame() {
  console.log("rendering on speed " + speedRange.value + " fps");
  //   requestAnimationFrame(() => drawFrame());
  setTimeout(function () {
    requestAnimationFrame(() => drawFrame());

    // animating/drawing code goes here
  }, 1000 / parseInt(speedRange.value));
}

drawFrame();

export {};

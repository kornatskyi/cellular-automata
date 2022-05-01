import { DrawElement } from "../interfaces/Rendering";
import { Position } from "../types/global";


const getEventLocation = (e: TouchEvent | MouseEvent): Position => {

  if (e instanceof TouchEvent) {
    if (e.touches && e.touches.length == 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }
  if (e instanceof MouseEvent) {
    if (e.clientX && e.clientY) {
      return { x: e.clientX, y: e.clientY };
    }
  }

  throw new Error("Wrong event! in getEventLocation(e: TouchEvent | MouseEvent) method")
}
export class Renderer {
  static _instance: Renderer;
  private fps = 1;
  private thingsToDraw: DrawElement[] = [];

  private canvas: HTMLCanvasElement;
  private canvasContainer: HTMLElement;
  private ctx: CanvasRenderingContext2D;

  private cameraOffset: Position;
  private cameraZoom = 1;
  private MAX_ZOOM = 5;
  private MIN_ZOOM = 0.07;
  private SCROLL_SENSITIVITY = 0.0003;

  private isDragging = false;
  private dragStart: Position = { x: 0, y: 0 };

  private initialPinchDistance: number | null = null;
  private lastZoom: number;

  constructor(thingsToDraw: DrawElement[]) {
    // Make Renderer singleton 
    if (Renderer._instance) {
      throw new Error("Singleton classes can't be instantiated more than once.")
    }
    Renderer._instance = this;

    // Populating things we are going to draw 
    this.thingsToDraw = thingsToDraw

    // This element will be used as a container for canvas
    this.canvasContainer =
      document.getElementById("canvas-container") ??
      (() => {
        throw new Error("No canvas container in DOM!");
      })();

    // Creating canvas
    this.canvas = <HTMLCanvasElement>document.createElement("canvas");

    // Setting canvas size depending on parent container size
    this.canvas.width = this.canvasContainer.offsetWidth;
    this.canvas.height = this.canvasContainer.offsetHeight;

    // Inserting canvas into container
    this.canvasContainer.appendChild(this.canvas);

    this.ctx =
      this.canvas.getContext("2d") ??
      (() => {
        throw new Error("Unable to get canvas context!");
      })();

    this.cameraOffset = {
      x: this.canvasContainer.offsetWidth / 2,
      y: this.canvasContainer.offsetHeight / 2,
    };

    this.lastZoom = this.cameraZoom;





    const onPointerDown = (e: TouchEvent | MouseEvent) => {

      this.isDragging = true;
      this.dragStart.x = getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x;
      this.dragStart.y = getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y;
    }

    const onPointerMove = (e: TouchEvent | MouseEvent) => {
      if (this.isDragging) {
        this.cameraOffset.x = getEventLocation(e).x / this.cameraZoom - this.dragStart.x;
        this.cameraOffset.y = getEventLocation(e).y / this.cameraZoom - this.dragStart.y;
      }
    }

    const onPointerUp = () => {
      this.isDragging = false;
      this.initialPinchDistance = null;
      this.lastZoom = this.cameraZoom;
    }



    const handleTouch = (e: TouchEvent, singleTouchHandler: (e: TouchEvent) => void) => {
      if (e.touches.length == 1) {
        singleTouchHandler(e);
      } else if (e.type == "touchmove" && e.touches.length == 2) {
        this.isDragging = false;
        handlePinch(e);
      }
    }

    const handlePinch = (e: TouchEvent) => {
      e.preventDefault();

      const touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      const currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

      if (this.initialPinchDistance == null) {
        this.initialPinchDistance = currentDistance;
      } else {
        adjustZoom(null, currentDistance / this.initialPinchDistance);
      }
    }

    const adjustZoom = (zoomAmount: number | null, zoomFactor: number | null) => {
      if (!this.isDragging) {
        if (zoomAmount) {
          this.cameraZoom += zoomAmount;
        } else if (zoomFactor) {
          console.log(zoomFactor);
          this.cameraZoom = zoomFactor * this.lastZoom;
        }
        this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM);
        this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM);
      }
    }

    this.canvas.addEventListener("mousedown", onPointerDown);
    this.canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
    this.canvas.addEventListener("mouseup", onPointerUp);
    this.canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
    this.canvas.addEventListener("mousemove", onPointerMove);
    this.canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
    this.canvas.addEventListener("wheel", (e) => adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY, null));

    // Ready, set, go
    this.render();
  }


  // Recursive function which is responsible for rendering all DrawElements to canvas
  render() {
    this.canvas.width = this.canvasContainer.offsetWidth;
    this.canvas.height = this.canvasContainer.offsetHeight;
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    // ctx.translate(cursorPosition.x / 2, cursorPosition.y / 2)
    this.ctx.scale(this.cameraZoom, this.cameraZoom);
    this.ctx.translate(-this.canvasContainer.offsetWidth / 2 + this.cameraOffset.x, -this.canvasContainer.offsetHeight / 2 + this.cameraOffset.y);
    this.ctx.clearRect(0, 0, this.canvasContainer.offsetWidth, this.canvasContainer.offsetHeight);

    this.thingsToDraw.forEach((element) => {
      element.draw(this.ctx);
    });
    console.log("draw");

    // need to bind callback function to this instance
    setTimeout((function () {
      requestAnimationFrame(() => this.render());
    }).bind(this), 1000 / this.fps);
  }

  // Gets the relevant location from a mouse or single touch event


}

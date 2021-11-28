const speedRange = <HTMLInputElement>(
  document.querySelector("#cellular-automate-controls-sliders-speed-input")
);
const speedRangeValueElement = document.querySelector(
  ".speed-range-value"
) as HTMLSpanElement;

console.log("hello");

speedRange.addEventListener("input", function () {
  speedRangeValueElement.innerText = `${this.value}`;
});

export {};

// const speedRange = <HTMLInputElement>document.querySelector('#cellular-automate-controls-sliders-speed-input')
// const speedRangeValueElement = document.querySelector('.speed-range-value') as HTMLSpanElement

// speedRange.addEventListener('input', function () {
//   speedRangeValueElement.innerText = `${this.value}`
// })

class App {
  body: HTMLElement
  children: string[]

  constructor(children: string[] = []) {
    this.body = document.querySelector('body')
    this.children = children
  }

  addChild(child: string) {
    this.children.push(child)
  }

  render() {
    console.log('rendering')

    this.children.forEach((child) => {
      console.log('🚀 ~ child', child)
      this.body.innerHTML += child
    })
  }
}

const app = new App()

class Button {
  parent: HTMLElement
  children: HTMLElement[]

  constructor(parent: HTMLElement = null) {
    this.parent = parent
    this.children = []
  }

  render() {
    return `<button class="button border-2">I'm a button</button>`
  }
}

class Range {
  parent: HTMLElement
  children: HTMLElement[]

  constructor(parent: HTMLElement = null) {
    this.parent = parent
    this.children = []
  }

  render() {
    return `<input type="range" min="0" max="100" value="50" class="slider" id="myRange">`
  }
}

class ControlPanel {
  parent: HTMLElement
  children: HTMLElement[]

  constructor(parent: HTMLElement) {
    this.parent = parent
    this.children = []
  }

  render() {
    return `<div id="cellular-automate-controls" class="text-cyan-500">Hello world
    
        ${new Button(this.parent).render()}
        ${new Range(this.parent).render()}
    
    </div>`
  }
}

app.addChild(new ControlPanel(document.querySelector('body')).render())

app.render()

export {}

import { html } from '../utils/inlineHTML'
import Icon from '../assets/logo.svg'
import { Renderer } from '../classes/Renderer'
import { Rule } from '../classes/Rule'
import { ElementaryCellularAutomata } from '../classes/ElementaryCellularAutomata'

const allCombinationOfThreeCells = [
  [false, false, false],
  [false, false, true],
  [false, true, false],
  [false, true, true],
  [true, false, false],
  [true, false, true],
  [true, true, false],
  [true, true, true],
]

export class ControlPanel {
  renderer: Renderer
  elementaryCellularAutomata: ElementaryCellularAutomata | null
  rule = new Rule(false, false, false, false, false, false, false, false)
  started = false
  wrapper: HTMLElement
  getWrapper(): HTMLElement {
    return this.wrapper
  }
  constructor() {
    try {
      this.renderer = Renderer.getInstance()
    } catch (e) {
      console.log('Creating new Renderer instance in ControlPanel')
      this.renderer = new Renderer()
    }

    // Wrapper(container) element
    this.wrapper = document.createElement('div')
    this.wrapper.className = 'wrapper'

    // Header
    const header = this.wrapper.appendChild(document.createElement('div'))
    header.className = 'header'
    const logo = header.appendChild(document.createElement('img'))
    const title = header.appendChild(document.createElement('h3'))
    title.innerText = 'Elementary Cellular Automata'
    logo.src = Icon
    logo.className = 'logo'

    const ruleContainer = document.createElement('div')
    ruleContainer.className = 'ruleContainer'

    // filling out ruleContainer

    allCombinationOfThreeCells.forEach((threeCellsValues, i) => {
      const cell = document.createElement('div')
      const threeCells = document.createElement('div')
      const cellsBlock = document.createElement('div')

      cell.className = 'cell'
      threeCells.className = 'threeCells'
      cellsBlock.className = 'cellsBlock'

      cell.style.backgroundColor = threeCellsValues[0] ? 'black' : 'white'
      threeCells.appendChild(cell.cloneNode())
      cell.style.backgroundColor = threeCellsValues[1] ? 'black' : 'white'
      threeCells.appendChild(cell.cloneNode())
      cell.style.backgroundColor = threeCellsValues[2] ? 'black' : 'white'
      threeCells.appendChild(cell.cloneNode())

      const resultCell = document.createElement('div')

      resultCell.className = 'cell resultCell'
      resultCell.style.backgroundColor = this.rule.getRuleInFormOfBooleans()[i] ? 'black' : 'white'

      // Change rule
      resultCell.onclick = () => {
        this.rule.setRuleByIndex(i, !this.rule.getRuleInFormOfBooleans()[i])
        resultCell.style.backgroundColor = this.rule.getRuleInFormOfBooleans()[i] ? 'black' : 'white'
      }

      cellsBlock.appendChild(threeCells)
      cellsBlock.appendChild(resultCell)
      ruleContainer.appendChild(cellsBlock)
    })
    // Appending Rule Container
    this.wrapper.appendChild(ruleContainer)

    const buttons = document.createElement('div')
    buttons.className = 'buttons'

    const reset = buttons.appendChild(document.createElement('button'))
    const stop = buttons.appendChild(document.createElement('button'))
    const start = buttons.appendChild(document.createElement('button'))
    start.textContent = 'Start'
    stop.textContent = 'Stop'
    reset.textContent = 'Reset'
    reset.disabled = true
    stop.disabled = true

    reset.onclick = () => {
      console.log(' ~ ', 'Reset')

      // Resetting Automaton
      this.elementaryCellularAutomata?.resetAutomaton()

      // Clear renderer list of objects to draw
      this.renderer.clearDrawingList()

      this.started = false
      start.disabled = false
      stop.disabled = true
    }

    stop.onclick = () => {
      console.log(' ~ ', 'Stop')

      // Stops generation of new cells on the Automaton side
      this.elementaryCellularAutomata?.stopAutomaton()
      this.started = false
      start.disabled = false
      stop.disabled = true
    }

    start.onclick = () => {
      if (!this.elementaryCellularAutomata) {
        this.elementaryCellularAutomata = new ElementaryCellularAutomata()
      }

      console.log(this.rule)

      this.elementaryCellularAutomata.setRule(this.rule)
      this.renderer.addThingsToDraw([this.elementaryCellularAutomata])

      this.elementaryCellularAutomata.startAutomaton()
      console.log('🚀 ~ ', 'Start')
      this.started = true
      start.disabled = this.started
      stop.disabled = false
      reset.disabled = false
    }

    this.wrapper.appendChild(buttons)
  }
}

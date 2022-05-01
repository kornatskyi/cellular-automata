import { html } from '../utils/inlineHTML'
import Icon from '../assets/logo.svg'

const allCombinationOfThreeCells = [
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
    [true, true, true]
];

export class ControlPanel extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const style = html`
             <style>
             .wrapper {
                 width: 100%;
                 border: 1px solid black;
                 background-color: rgba(255, 255, 255, 50%)
               }
         
               .cell {
                   width: 10px;
                   height: 10px;
                   border:1px solid black;
               }
               .resultCell {
                   margin-top: 5px;
                   cursor: pointer;
               }
               .threeCells {
                   display:flex;
               }
               .cellsBlock {
                   display:flex;
                   flex-direction: column;
                   align-items: center;
               }
               .ruleContainer {
                    display: flex;
                    justify-content: space-around;
                    width:400px; 
               }
               button {
                   margin: 10px 5px;
               }
               .buttons {
                   display: flex;
                   justify-content: flex-end;
               }
               .logo {
                   width: 40px;
                   height: 40px;
                   margin: 10px;
               }
               .header  {
                   display: flex;
                   
               }

             </style>
        `

        // Wrapper(container) element
        const wrapper = document.createElement('div')
        wrapper.className = "wrapper"
        // Inserting styles "dangerously"
        wrapper.insertAdjacentHTML('beforeend', style)

        // Header
        const header = wrapper.appendChild(document.createElement('div'))
        header.className = "header"
        const logo = header.appendChild(document.createElement('img'))
        const title = header.appendChild(document.createElement('h3'))
        title.innerText = "Elementary Cellular Automata"
        logo.src = Icon
        logo.className = "logo"


        const ruleContainer = document.createElement('div')
        ruleContainer.className = "ruleContainer"


        // filling out ruleContainer
        for (const threeCellsValues of allCombinationOfThreeCells) {
            const cell = document.createElement('div')
            const threeCells = document.createElement('div')
            const cellsBlock = document.createElement('div')

            cell.className = 'cell'
            threeCells.className = 'threeCells'
            cellsBlock.className = "cellsBlock"

            cell.style.backgroundColor = threeCellsValues[0] ? 'black' : 'white'
            threeCells.appendChild(cell.cloneNode())
            cell.style.backgroundColor = threeCellsValues[1] ? 'black' : 'white'
            threeCells.appendChild(cell.cloneNode())
            cell.style.backgroundColor = threeCellsValues[2] ? 'black' : 'white'
            threeCells.appendChild(cell.cloneNode())

            const resultCell = document.createElement('div');

            resultCell.className = 'cell resultCell'
            resultCell.style.backgroundColor = 'red'

            cellsBlock.appendChild(threeCells);
            cellsBlock.appendChild(resultCell)
            ruleContainer.appendChild(cellsBlock)

        }
        // Appending Rule Container 
        wrapper.appendChild(ruleContainer)

        const buttons = document.createElement('div')
        buttons.className = "buttons"

        const restart = buttons.appendChild(document.createElement('button'))
        restart.textContent = 'Restart'

        const stop = buttons.appendChild(document.createElement('button'))
        stop.textContent = 'Stop'

        const start = buttons.appendChild(document.createElement('button'))
        start.textContent = 'Start'


        wrapper.appendChild(buttons)

        this.shadowRoot?.append(wrapper)
    }
}

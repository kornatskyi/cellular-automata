// import '../src/pages/rules/rules'
import { ElementaryCellularAutomata } from './classes/ElementaryCellularAutomata'
import { Renderer } from './classes/Renderer'
import './styles/index.scss'
import './styles/tailwind-global.css'


new Renderer([new ElementaryCellularAutomata()]);

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}
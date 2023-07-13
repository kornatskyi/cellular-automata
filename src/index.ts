// import '../src/pages/rules/rules'
import { ControlPanel } from './components/ControlPanel'
import { ElementaryCellularAutomata } from './classes/ElementaryCellularAutomata'
import { Renderer } from './classes/Renderer'
import './styles/index.scss'

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}

const cP = document.getElementById("control-panel")



cP?.replaceChildren(new ControlPanel().getWrapper())

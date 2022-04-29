// import '../src/pages/rules/rules'
import { Cell } from './classes/Cell'
import { Renderer } from './classes/Renderer'
import Rules from './classes/Rules'
import './styles/index.scss'
import './styles/tailwind-global.css'

Renderer.thingsToDraw = [new Cell()]
Renderer.start()

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}
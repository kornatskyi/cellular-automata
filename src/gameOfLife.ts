import './styles/index.scss'
import { Cell } from "./classes/Cell";
import { Renderer } from "./classes/Renderer";

// Setting page visibility back to visible
document.body.style.opacity = '1'

/** Hot module reload */
if (module.hot) {
  // Accept hot update
  module.hot.accept()
}


const r = new Renderer()


const c = new Cell(true, {x: 100, y : 960} )

r.addThingsToDraw([c])

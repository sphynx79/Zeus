// src/components/filtri/filtri.js

import "./filtri.css"
import {Accordion} from 'carbon-components';
import FiltroData  from "components/filtro_data/filtro_data.js"
import FiltroLinee  from "components/filtro_linee/filtro_linee.js"
import FiltroUnita  from "components/filtro_unita/filtro_unita.js"

class Filtri {

    constructor() {
        this._componentName = this.constructor.name
    }

    view({attrs,state}) {
        return m(".filtri",[
            m("ul.bx--accordion[data-accordion='']", [
                m(FiltroData),
                m(FiltroLinee),
                m(FiltroUnita)
            ])
        ])
    }

    oncreate(vnode) {
        let el = vnode.dom.firstElementChild
        Accordion.create(el)
        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default Filtri

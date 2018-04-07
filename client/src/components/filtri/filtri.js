// src/components/filtri/filtri.js

import "./filtri.scss"
import Accordion from "carbon_component/accordion/accordion.js"
import FiltroData from "components/filtro_data/filtro_data.js"
import FiltroLinee from "components/filtro_linee/filtro_linee.js"
import FiltroTecnologia from "components/filtro_tecnologia/filtro_tecnologia.js"
import FiltroSocieta from "components/filtro_societa/filtro_societa.js"
import FiltroUnita from "components/filtro_unita/filtro_unita.js"

class Filtri {
    constructor() {
        this._componentName = this.constructor.name
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m(".filtri", [
            m("ul.bx--accordion[data-accordion='']", [
                m(FiltroData),
                m(FiltroLinee),
                m(FiltroTecnologia),
                m(FiltroSocieta),
                m(FiltroUnita),
            ]),
        ])
    }

    oncreate(vnode) {
        let el = vnode.dom.firstElementChild
        Accordion.create(el)
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default Filtri

// src/components/filtro_impianto/filtro_impianto.js

import "./filtro_impianto.scss"
import FiltriItem from "components/filtri_item/filtri_item.js"
import FiltroImpiantoContent from "components/filtro_impianto_content/filtro_impianto_content.js"

class FiltroImpianto {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view() {
        // prettier-ignore
        return m(FiltriItem, {
            content: FiltroImpiantoContent,
            content_id: "filtro_impianto",
            content_title: "Impianto",
        })
    }

    oncreate({ attrs, state }) {
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default FiltroImpianto

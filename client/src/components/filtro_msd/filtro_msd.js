// src/components/filtro_msd/filtro_msd.js

import "./filtro_msd.scss"
import FiltriItem from "components/filtri_item/filtri_item.js"
import FiltroMsdContent from "components/filtro_msd_content/filtro_msd_content.js"

class FiltroMsd {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view() {
        // prettier-ignore
        return m(FiltriItem, {
            content: FiltroMsdContent,
            content_id: "filtro_msd",
            content_title: "Unità Abilitata MSD",
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

export default FiltroMsd

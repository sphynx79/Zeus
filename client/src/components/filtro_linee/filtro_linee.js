// src/components/filtro_linee/filtro_linee.js

import "./filtro_linee.scss"
import FiltriItem from "components/filtri_item/filtri_item.js"
import FiltroLineeContent from "components/filtro_linee_content/filtro_linee_content.js"

class FiltroLinee {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view() {
        // prettier-ignore
        return m(FiltriItem, {
            content: FiltroLineeContent,
            content_id: "filtro_linee",
            content_title: "Linee",
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

export default FiltroLinee

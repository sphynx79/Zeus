// src/components/filtro_sottotipo/filtro_sottotipo.js

import "./filtro_sottotipo.scss"
import FiltriItem from "components/filtri_item/filtri_item.js"
import FiltroSottotipoContent from "components/filtro_sottotipo_content/filtro_sottotipo_content.js"

class FiltroSottotipo {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view() {
        // prettier-ignore
        return m(FiltriItem, {
            content: FiltroSottotipoContent,
            content_id: "filtro_sottotipo",
            content_title: "Sottotipo",
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

export default FiltroSottotipo

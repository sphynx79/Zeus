// src/components/filtro_societa/filtro_societa.js

import "./filtro_societa.scss"
import FiltriItem           from "components/filtri_item/filtri_item.js"
import FiltroSocietaContent from "components/filtro_societa_content/filtro_societa_content.js"

class FiltroUnita {

    constructor() {
        this._componentName = this.constructor.name
    }

    view() {
        return m(FiltriItem,{content: FiltroSocietaContent, content_id: "filtro_societa", content_title: "Societa"})
    }

    oncreate({attrs,state}) {
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default FiltroUnita

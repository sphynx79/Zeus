// src/components/filtro_tecnologia/filtro_tecnologia.js

import FiltriItem              from "components/filtri_item/filtri_item.js"
import FiltroTecnologiaContent from "components/filtro_tecnologia_content/filtro_tecnologia_content.js"

class FiltroTecnologia {

    constructor() {
        this._componentName = this.constructor.name
    }

    view() {
        return m(FiltriItem,{content: FiltroTecnologiaContent, content_id: "filtro_tecnologia", content_title: "Tecnologia"})
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

export default FiltroTecnologia

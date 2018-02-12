// src/components/filtro_data/filtro_data.js

import "./filtro_data.css"
import DataPicker  from "components/datapicker/datapicker.js"
import FiltriItem  from "components/filtri_item/filtri_item.js"

class FiltroData {

    constructor() {
        this._componentName = this.constructor.name
    }

    oninit({attrs, state}) {

    }

    view({attrs,state}) {
        return m(FiltriItem,{content: DataPicker, content_id: 'filtro_data', content_title: 'Data'})
    }

    oncreate({attrs,state}) {
        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default FiltroData


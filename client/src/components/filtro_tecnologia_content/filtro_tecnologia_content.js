// src/components/filtro_tecnologia_content/filtro_tecnologia_content.js

import stream   from "mithril/stream"
import CheckBox from "components/checkbox/checkbox.js"

class FiltroTecnologiaContent {

    constructor() {
        this._componentName = this.constructor.name
        this.checkboxs      = [{label: "Termico",        state: appState.termico_visibility},
                               {label: "Eolico",         state: appState.eolico_visibility},
                               {label: "Idrico",         state: appState.idrico_visibility},
                               {label: "Autoproduttore", state: appState.autoprod_visibility},
                               {label: "Solare",         state: appState.solare_visibility},
                               {label: "Pompaggi",       state: appState.pompaggi_visibility},
                               {label: "Geotermico",     state: appState.geotermico_visibility}
        ]
    }

    view({state}) {
        return m("fieldset.bx--fieldset",[
            this.checkboxs.map(checkbox => {
                  let label = checkbox.label
                  let checkBoxId ="bx--"+label.toLowerCase().replace(" ", "-")
                  return m(CheckBox, {
                    id:    checkBoxId,
                    label: label,
                    checked: checkbox.state(),
                    onchange: () => {checkbox.state(!checkbox.state())}
                })
            })
        ])
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

export default FiltroTecnologiaContent

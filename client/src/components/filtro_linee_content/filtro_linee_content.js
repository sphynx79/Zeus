// src/components/filtro_linee_content/filtro_linee_content.js

import stream    from "mithril/stream"
import CheckBox  from "components/checkbox/checkbox.js"

class FiltroLineeContent {

    constructor() {
        this._componentName = this.constructor.name
        this.checkboxs      = [{label: "Linee 380", state: appState.remit_380_visibility},
                               {label: "Linee 220", state: appState.remit_220_visibility}]
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

export default FiltroLineeContent

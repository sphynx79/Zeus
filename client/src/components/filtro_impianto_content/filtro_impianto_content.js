// src/components/filtro_impianto_content/filtro_impianto_content.js

import Select from "components/select/select.js"

class FiltroImpiantoContent {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    oninit({ state }) {
        state.id = "impianto"
        state.$filterOpt = lens({
            get: () => appState.dispatch("parseFilter", [appState.$filterImpianto.get(), state.id]),
            set: selection => appState.$selectImpianto.set(selection),
        })
    }

    view({ state }) {
        // prettier-ignore
        return m(".bx--form-item",
                 [
                      m(Select, {
                          id: "#filtro_impianto",
                          placeholder: "Impianto",
                          data: state.$filterOpt,
                          onchange:  selection => state.$filterOpt.set(selection),
                      }),
                  ]
        )
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

export default FiltroImpiantoContent

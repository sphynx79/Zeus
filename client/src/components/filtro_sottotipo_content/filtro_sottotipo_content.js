// src/components/filtro_societa_content/filtro_societa_content.js

import Select from "components/select/select.js"
import { lens } from "derivable"

class FiltroSottotipoContent {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    oninit({ state }) {
        state.id = "sottotipo"
        state.$filterOpt = lens({
            get: () => appState.dispatch("parseFilter", [appState.$filterSottotipo.get(), state.id]),
            set: selection => appState.$selectSottotipo.set(selection),
        })
    }

    view({ state }) {
        // prettier-ignore
        return m(".bx--form-item",
                [
                      m(Select, {
                          id: "#filtro_sottotipo",
                          placeholder: "Sottotipo",
                          data: state.$filterOpt,
                          onchange: selection => state.$filterOpt.set(selection),
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

export default FiltroSottotipoContent

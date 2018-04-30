// src/components/filtro_unita_content/filtro_unita_content.js

import Select from "components/select/select.js"
import { lens } from "derivable"

class FiltroUnitaContent {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    oninit({ state }) {
        state.id = "etso"
        state.$filterOpt = lens({
            get: () => appState.dispatch("parseFilter", [appState.$filterUnita.get(), state.id]),
            set: selection => appState.$selectUnita.set(selection),
        })
        // appState.$unitaVisibility.react(r => console.dir(r))
        // appState.$etsoVisibility.react(r => console.dir(r), { skipFirst: true })
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m(".bx--form-item",
                 [
                      m(Select, {
                          id: "#filtro_unita",
                          placeholder: "Unita",
                          data: state.$filterOpt,
                         onchange: selection => {
                              state.$filterOpt.set(selection)
                          },
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

export default FiltroUnitaContent

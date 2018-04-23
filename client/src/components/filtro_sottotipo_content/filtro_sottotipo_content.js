// src/components/filtro_societa_content/filtro_societa_content.js

import Select from "components/select/select.js"
import { derive } from "derivable"

class FiltroSottotipoContent {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    _fetchData() {
        return appState.$lista_centrali.derive(items => this._parseFilter(items))
    }

    // _filterValue(select) {
    //     return appState.$lista_centrali.get().filter(item => (select.length == 0 ? true : select.includes(item.etso)))
    // }

    _parseFilter(items) {
        let unique = [...new Set(items.map(item => item["sottotipo"]))]
        let selectItems = unique.map(item => new Object({ value: item, text: item }))
        return selectItems
    }

    view({ state }) {
        // prettier-ignore
        return m(".bx--form-item",
            appState.$lista_centrali.get() === undefined
                ? ""
                : [
                      m(Select, {
                          id: "#filtro_sottotipo",
                          placeholder: "Sottotipo",
                          data: state._fetchData(),
                          onchange: values => {
                              appState.$selectSottotipo.set(values)
                              appState.sottotipo_visibility(values)
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

export default FiltroSottotipoContent

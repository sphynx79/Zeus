// src/components/filtro_societa_content/filtro_societa_content.js

import Select from "components/select/select.js"
import { derive } from "derivable"

class FiltroSocietaContent {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    _fetchData() {
        let selectValue = appState.$selectUnita.derive(select => this._filterValue(select))
        return selectValue.derive(items => this._parseFilter(items))
    }

    _filterValue(select) {
        return appState.$lista_centrali.get().filter(item => (select.length == 0 ? true : select.includes(item.etso)))
    }

    _parseFilter(items) {
        let unique = [...new Set(items.map(item => item["company"]))]
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
                          id: "#filtro_societa",
                          placeholder: "Societa",
                          data: state._fetchData(),
                          onchange: values => {
                              appState.$selectSocieta.set(values)
                              appState.societa_visibility(values)
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

export default FiltroSocietaContent

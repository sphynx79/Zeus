// src/components/filtro_unita_content/filtro_unita_content.js

import Select from "components/select/select.js"
import stream from "mithril/stream"

class FiltroUnitaContent {
    constructor() {
        this._componentName = this.constructor.name
    }

    _fetchData() {
        let selectValue = appState.selectSocieta.map(select => this._filterValue(select))
        return selectValue.map(items => this._parseFilter(items))
    }

    _filterValue(select) {
        return appState
            .lista_centrali()
            .filter(item => (select.length == 0 ? true : select.includes(item.company)))
    }

    _parseFilter(items) {
        let unique = [...new Set(items.map(item => item["etso"]))]
        let selectItems = unique.map(item => new Object({ value: item, text: item }))
        return selectItems
    }

    view({ attrs, state }) {
        return m(
            ".bx--form-item",
            appState.lista_centrali() === undefined
                ? ""
                : [
                      m(Select, {
                          id: "#filtro_unita",
                          placeholder: "Unita",
                          data: state._fetchData(),
                          onchange: values => {
                              appState.selectUnita(values)
                              appState.unita_visibility(values)
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

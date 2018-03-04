// src/components/filtro_societa_content/filtro_societa_content.js

import Select from "components/select/select.js"
import stream from "mithril/stream"

class FiltroSocietaContent {

    constructor() {
        this._componentName = this.constructor.name
    }

    _fetchData() {
        let selectValue = appState.selectUnita.map(select => (this._filterValue(select)))
        return selectValue.map(items => this._parseFilter(items))
    }

    _filterValue(select) {
        return appState.lista_centrali().filter(item => (select.length == 0 ? true : select.includes(item.etso)))
    }

    _parseFilter(items) {
       let unique      = [...new Set(items.map(item => item["company"]))]
       let selectItems = unique.map(item => (new Object({value: item, text: item})))
       return selectItems
    }

    oninit({state}) {
        // appState.fetchCentrali()
        // let selectValue = appState.selectUnita.map(select => (this.filterValue(select)))
        // state.select    = selectValue.map(items => this.parseFilter(items))
    }

    view({state}) {
        return m(".bx--form-item", appState.lista_centrali() === undefined ? "" : [m(Select, {
            id: "#filtro_societa",
            placeholder: "Societa", 
            data: state._fetchData(),
            onchange: (values) => {
                appState.selectSocieta(values)
                appState.societa_visibility(values)
            }
        })])
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

export default FiltroSocietaContent

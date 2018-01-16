// src/components/table/table.js

import "./table.css"
import stream  from 'mithril/stream'

class Table {

    constructor() {
        this._componentName = this.constructor.name
    }

    oninit({state}) {
        state.activeLine = stream(-1);
        appState.data.map(() => state.activeLine = stream(-1))
    }

    view({attrs,state}) {
        
        return appState.remit_380() ? m('table.darkTable', [
            m("tr",[this.header.map( key => m("th", key))]),
            this.featureValue.map((feature, index) => {
                return m("tr", {
                    key: index,
                    className: state.activeLine() === index ? 'active' : '',
                    onclick: () => {state._clickLine(feature, index)}}, 
                [
                    m("td", feature.properties.nome),
                    m("td", feature.properties.dt_upd),
                    m("td", feature.properties.start_dt),
                    m("td", feature.properties.end_dt),
                ])

            })

        ]
        ) : m('')

    }
   
    oncreate({attrs, state}) {
        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

    _clickLine(line, index) {
        this.activeLine(index)
        appState.dispatch("clickLine", [line])
    }
    
    get header() {
        return Object.keys(appState.remit_380().features[0].properties)
    }

    get featureValue() {
        return appState.remit_380().features
    }

}

export default Table

// src/components/table/table.js

import "./table.css"

class Table {

    constructor() {
        this._componentName = this.constructor.name
    }

    view({attrs,state}) {
        return appState.remit ? m('table.darkTable', attrs, [
            m("tr",[this.header.map( key => m("th", key))]),
            this.featureValue.map((feature) => {
                return m("tr", [
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

    get header() {
        return Object.keys(appState.remit.features[0].properties)
    }

    get featureValue() {
        return appState.remit.features
    }
}

export default Table

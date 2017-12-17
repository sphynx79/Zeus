// src/components/table/table.js

import "./table.css"

class Table {

    constructor() {
        this._componentName = this.constructor.name
    }

    oninit({state}){
        appState.remit.map(x => { this.features = x.features})
    }

    view({attrs,state}) {
        state.header       = []
        state.featureValue = []
        if (this.features){
            // this.features.map(x => {console.log(x.properties)})
            state.header = Object.keys(this.features[0].properties)
            state.featureValue = this.features

        }

        return m('table.darkTable', attrs, [
            m("tr",[state.header.map( key => m("th", key))]),
            state.featureValue.map((feature) => {
                return m("tr", [
                    m("td", feature.properties.nome),
                    m("td", feature.properties.dt_upd),
                    m("td", feature.properties.start_dt),
                    m("td", feature.properties.end_dt),

                ])

            })

        ]
        )
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

}

export default Table

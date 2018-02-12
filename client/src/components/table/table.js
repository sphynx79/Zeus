// src/components/table/table.js

import "./table.css"
import stream  from 'mithril/stream'

class Table {

    constructor() {
        this._componentName = this.constructor.name
    }

    oninit({attrs, state}) {
        state.volt       = attrs.volt
        state.activeLine = stream(-1);
        appState.data.map(() => state.activeLine = stream(-1))
    }

    view({attrs,state}) {
        let remit = attrs.volt == "380" ? appState.remit_380() : appState.remit_220()
        if ((remit) && (remit.features.length == 0)){ remit = undefined }  


        return remit ? m('table.darkTable', [m("caption", `TRANSMISSION ${attrs.volt}`),
            m("tr",[this._header(remit).map( key => m("th", key))]),
            this._featureValue(remit).map((feature, index) => {
                return m("tr", {
                    key: index,
                    className: state.activeLine() === index ? 'active' : '',
                    onclick: () => {state._clickLine(feature, index)}
                    },
                    [
                        m("td", {style: "width:280px;"} , feature.properties.nome),
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

    _header(remit) {
        return Object.keys(remit.features[0].properties)
    }

    _featureValue(remit) {
        return remit.features
    }

}

export default Table

// src/components/table/table.js

import "./table.scss"
import stream from "mithril/stream"

class Table {
    constructor() {
        this._componentName = this.constructor.name
    }

    _clickRow(feature, index) {
        this.activeLine(index)
        if (this.type == "linee") {
            appState.dispatch("clickTableLine", [feature])
        } else {
            appState.dispatch("clickTableCentrale", [feature])
        }
    }

    _header(remit) {
        return Object.keys(remit.features[0].properties)
    }

    _featureValue(remit) {
        return remit.features
    }

    oninit({ attrs, state }) {
        if (attrs.type == "linee") {
            state.volt = attrs.volt
        }
        state.type = attrs.type
        state.activeLine = stream(-1)
        appState.data.map(() => (state.activeLine = stream(-1)))
    }

    view({ attrs, state }) {
        if (attrs.type == "linee") {
            var remit = attrs.volt == "380" ? appState.remit_380() : appState.remit_220()
            var titolo = `TRANSMISSION ${attrs.volt}`
            var tableType = "linee"
        } else {
            var remit = appState.remit_centrali()
            var titolo = "Centrali"
            var tableType = "centrali"
        }

        if (remit && remit.features.length == 0) {
            remit = undefined
        }

        // prettier-ignore
        return remit
            ? m(".tbl", [
                m(".tbl__header", [
                    m("table", [ 
                        m("caption", titolo), 
                        m(`thead.thead-${attrs.type}`, m("tr", this._header(remit).map(key => m("th", { class: key }, key))))
                    ])  
                ]),
                m(".tbl__content", [
                    m("table", [  
                        m(`tbody.tbody-${attrs.type}`, this._featureValue(remit).map((feature, index) => {
                            return m("tr", state.row_attrs(feature, index), state.row_values(feature))
                        }))
                    ])
                ]),
            ])
            : m("")
    }

    row_attrs(feature, index) {
        return {
            key: index,
            className: this.activeLine() === index ? "active" : "",
            onclick: () => {
                this._clickRow(feature, index)
            },
        }
    }

    row_values(feature) {
        var values = []
        for (let [key, value] of Object.entries(feature.properties)) {
            values.push(m("td", { class: key }, value))
        }
        return values
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

export default Table

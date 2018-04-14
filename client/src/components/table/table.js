// src/components/table/table.js

import "./table.scss"
import { derive } from "derivable"
import SimpleBar from "SimpleBar"

class Table {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    _clickRow(feature, index) {
        this.activeLine = index
        if (this.type == "linee") {
            appState.$selectLine.set(feature)
        } else {
            appState.$selectCentrale.set(feature)
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
        state.activeLine = -1
        appState.$data.derive(() => (state.activeLine = -1))
    }

    view({ attrs, state }) {
        if (attrs.type == "linee") {
            var remit = attrs.volt == "380" ? appState.$remit_380.get() : appState.$remit_220.get()
            var titolo = `TRANSMISSION ${attrs.volt}`
            var tableType = "linee"
        } else {
            var remit = appState.$remit_centrali.get()
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
                m(".tbl__content[data-simplebar='']", [
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
            className: this.activeLine === index ? "active" : "",
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

    oncreate(vnode) {
        // var el = vnode.dom
        // console.log(el)
        // SimpleScrollbar.initEl(el)
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default Table

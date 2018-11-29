// src/components/table/table.js

import "./table.scss"

class Table {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    oninit({ attrs, state }) {
        state.type = attrs.type
        state.activeLine = -1
        state.titolo = `TRANSMISSION ${attrs.volt}`
        appState.$data.react(() => (state.activeLine = -1))
        if (attrs.type == "linee") {
            let remit = attrs.volt == "380" ? appState.$remit_380 : appState.$remit_220
            remit.react(r => {
                state.remit = r.features
                m.redraw()
            })
        } else {
            state.titolo = "CENTRALI"
            appState.$remitCentraliFiltered.react(r => {
                state.remit = r
                m.redraw()
            })
        }
    }

    view({ attrs, state }) {
        // prettier-ignore
        return state.remit.length != 0
            ? m(".tbl", [
                m(".tbl__header", [
                    m("table", [ 
                        m("caption", state.titolo), 
                        m(`thead.thead-${attrs.type}`, m("tr", this._header().map(key => m("th", { class: key }, key))))
                    ])  
                ]),
                m(".tbl__content[data-simplebar='']", [
                    m("table", [  
                        m(`tbody.tbody-${attrs.type}`, this.remit.map((feature, index) => {
                            return m("tr", state.row_attrs(feature, index), state.row_values(feature))
                        }))
                    ])
                ]),
            ])
            : m("")
    }

    _clickRow(feature, index) {
        this.activeLine = index
        if (this.type == "linee") {
            appState.$selectLine.set(feature)
        } else {
            appState.$selectCentrale.set(feature)
        }
    }

    _header() {
        return Object.keys(this.remit[0].properties)
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

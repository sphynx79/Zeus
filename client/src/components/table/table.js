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
        } else {
            var remit = appState.remit_centrali()
            var titolo = "Centrali"
        }

        if (remit && remit.length == 0) {
            remit = undefined
        }

        return remit
            ? m("table.bx--data-table-v2.bx--data-table-v2--compact.bx--data-table-v2--zebra", [
                  m("caption", titolo),
                  m("thead", m("tr", [this._header(remit).map(key => m("th", key))])),
                  m("tbody", [
                      this._featureValue(remit).map((feature, index) => {
                          return m(
                              "tr",
                              {
                                  key: index,
                                  className: state.activeLine() === index ? "active" : "",
                                  onclick: () => {
                                      state._clickRow(feature, index)
                                  },
                              },
                              [
                                  m("td", { style: "width:280px;" }, feature.properties.nome),
                                  m("td", feature.properties.dt_upd),
                                  m("td", feature.properties.start_dt),
                                  m("td", feature.properties.end_dt),
                              ]
                          )
                      }),
                  ]),
              ])
            : m("")
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

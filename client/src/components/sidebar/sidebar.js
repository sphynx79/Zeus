// src/components/sidebar/sidebar.js

import "./sidebar.scss"
import TableCentrali from "components/tablecentrali/tablecentrali.js"
import TableLinee from "components/tablelinee/tablelinee.js"
// import Table from "components/table/table.js"
import Filtri from "components/filtri/filtri.js"

class SideBar {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view({ attrs }) {
        // prettier-ignore
        if (attrs.type == "right") { 
            return m("nav.sidebar#sidebar_right", attrs, [appState.$lista_centrali.get() === undefined ? "" : m(Filtri)])
        } else {
            return m("nav.sidebar#sidebar_left", attrs, [
                appState.$remit_380.get() === undefined ? "" : m(TableLinee, { type: "linee", volt: "380", remit: appState.$remit_380  }),
                appState.$remit_220.get() === undefined ? "" : m(TableLinee, { type: "linee", volt: "220", remit: appState.$remit_220 }),
                appState.$remit_centrali.get() === undefined ? "" : m(TableCentrali, { type: "centrali", remit: appState.$remitCentraliFiltered }),
            ])
        }
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

export default SideBar

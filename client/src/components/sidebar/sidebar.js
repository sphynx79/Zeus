// src/components/sidebar/sidebar.js

import "./sidebar.scss"
import Table from "components/table/table.js"
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
            return m("nav.sidebar#sidebar_right", attrs, [m(Filtri)])
        } else {
            return m("nav.sidebar#sidebar_left", attrs, [
                m(Table, { type: "linee", volt: "380" }),
                m(Table, { type: "linee", volt: "220" }),
                m(Table, { type: "centrali" }),
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

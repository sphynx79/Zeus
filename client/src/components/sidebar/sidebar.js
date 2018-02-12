// src/components/sidebar/sidebar.js

import "./sidebar.scss"
import Table       from "components/table/table.js"
import Filtri      from "components/filtri/filtri.js"

class SideBar {

    constructor() {
        this._componentName = this.constructor.name
    }

    view({attrs}) {
        if (attrs.type == "right") {
            return m('nav.sidebar#sidebar_right', attrs, [m(Filtri)])       
        } else { 
            return m('nav.sidebar#sidebar_left', attrs, [m(Table, {volt: "380"}), m(Table, {volt: "220"})])  
        }
        
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

export default SideBar

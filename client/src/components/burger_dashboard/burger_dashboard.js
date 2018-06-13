// src/components/burger_dashboard/burger_dashboard.js

import "./burger_dashboard.scss"

class BurgerDashboard {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view({ attrs }) {
        return m(".burger__dashboard", attrs, [m("#left-bar"), m("#right-bar")])
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

export default BurgerDashboard

// src/components/dashboard/dashboard.js

import "./dashboard.scss"
import Grafico from "components/grafico/grafico.js"

class Dashboard {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    _getRemit(url) {
        m.request({
            method: "GET",
            url: url,
        })
            .then(response => {
                this.$remitReport = response
            })
            .catch(err => {
                console.log(`Errore richiesta json remit  ${url}`, err)
            })
    }

    oninit({ state }) {
        state.$remitReport = []
        let urlRemitReport = `http://${appState.server}:${appState.port}/api/v1/report_centrali/20-03-2018/20-04-2018`
        this._getRemit(urlRemitReport)
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m("nav.dashboard", attrs, [
            state.$remitReport.length > 0 ? m(Grafico, { remit: state.$remitReport }) : "",
        ])
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

export default Dashboard

// src/components/dashboard/dashboard.js

import "./dashboard.scss"
import Grafico from "components/grafico/grafico.js"
import { atom, derive } from "derivable"

class Dashboard {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    _getRemit(url) {
        let request = m.request({
            method: "GET",
            url: url,
        })
        return request
    }

    oninit({ state }) {
        let startDt = derive(() =>
            dayjs(appState.$data.get())
                .subtract(2, "month")
                .format("DD-MM-YYYY")
        )
        let endDt = derive(() =>
            dayjs(appState.$data.get())
                .add(7, "day")
                .format("DD-MM-YYYY")
        )

        state.$remitReport = derive(() => state._getRemit(`http://${appState.server}:${appState.port}/api/v1/report/centrali/${startDt.get()}/${endDt.get()}`))
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m("nav.dashboard", attrs, m( "#grafico" ,[
            m(Grafico, { 
                elId: "grafico__remit",
                title: "Totale indisponibilità programmate lungo termine per tecnologia",
                data:  state.$remitReport 
            }),
            m(Grafico, { 
                elId: "grafico__giornaliero",
                title: "Totale indisponibilità programmate breve termine per tecnologia",
                data: state.$remitReport
            }),
            m(Grafico, { 
                elId: "grafico__zone",
                title: "Totale indisponibilità programmate lungo termine per zona",
                data: state.$remitReport
            }),
            m(Grafico, { 
                elId: "grafico__giornaliero__zone",
                title: "Totale indisponibilità programmate breve termine per zona",
                data: state.$remitReport
            }),

        ]))
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

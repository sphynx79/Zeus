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
        let startDt = derive(() => dayjs(appState.$data.get()).subtract(11, 'month').format('DD-MM-YYYY'))
        let endDt = derive(() => dayjs(appState.$data.get()).add(1, 'month').format('DD-MM-YYYY'))  
        let startDtGiornaliera = derive(() => dayjs(appState.$data.get()).subtract(6, 'day').format('DD-MM-YYYY'))
        let endDtGiornaliera = derive(() => dayjs(appState.$data.get()).add(1, 'day').format('DD-MM-YYYY'))  
        state.$remitReportTecnologia = derive(() => state._getRemit(`http://${appState.server}:${appState.port}/api/v1/reports/${startDt.get()}/${endDt.get()}/centrali_tecnologia`))
        state.$remitReportGiornalieroTecnologia = derive(() => state._getRemit(`http://${appState.server}:${appState.port}/api/v1/reports/${startDtGiornaliera.get()}/${endDtGiornaliera.get()}/centrali_giornaliero_tecnologia`))
        state.$remitReportZona = derive(() => state._getRemit(`http://${appState.server}:${appState.port}/api/v1/reports/${startDt.get()}/${endDt.get()}/centrali_zona`))
        state.$remitReportGiornalieroZona = derive(() => state._getRemit(`http://${appState.server}:${appState.port}/api/v1/reports/${startDtGiornaliera.get()}/${endDtGiornaliera.get()}/centrali_giornaliero_zona`))
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m("nav.dashboard", attrs, m( "#grafico" ,[
            m(Grafico, { 
                elId: "grafico__remit",
                title: "Totale indisponibilità programmate lungo termine per tecnologia",
                data: state.$remitReportTecnologia 
            }),
            m(Grafico, { 
                elId: "grafico__giornaliero",
                title: "Totale indisponibilità programmate breve termine per tecnologia",
                data: state.$remitReportGiornalieroTecnologia 
            }),
            m(Grafico, { 
                elId: "grafico__zone",
                title: "Totale indisponibilità programmate lungo termine per zona",
                data: state.$remitReportZona
            }),
            m(Grafico, { 
                elId: "grafico__giornaliero__zone",
                title: "Totale indisponibilità programmate breve termine per zona",
                data: state.$remitReportGiornalieroZona
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

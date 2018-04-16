// src/model/app.js

import stream from "mithril/stream"
import { atom, derive } from "derivable"

class App {
    constructor() {
        this._modelName = this.constructor.name
        this.server = window.location.hostname
        // server configuration
        this.port = process.env.NODE_ENV == "production" ? 80 : 9292
        // sidebar state to interact with burger with sidebar, in layout.js
        this.sidebarLeft = false
        this.sidebarRight = false
        this.$data = atom()
        // click table row fly in mapbox
        this.$selectLine = atom()
        this.$selectCentrale = atom()
        // toggle visibility linee
        this.$linee_380_visibility = atom(true)
        this.$linee_220_visibility = atom(true)
        this.termico_visibility = stream(true)
        this.eolico_visibility = stream(true)
        this.idrico_visibility = stream(true)
        this.autoprod_visibility = stream(true)
        this.solare_visibility = stream(true)
        this.pompaggi_visibility = stream(true)
        this.geotermico_visibility = stream(true)
        this.societa_visibility = stream([])
        this.unita_visibility = stream([])

        // sincronizzare i filtri
        this.$lista_centrali = atom(this.fetchCentrali())
        this.$selectSocieta = atom([])
        this.$selectUnita = atom([])

        this.$remit_220 = atom()
        this.$remit_380 = atom()
        this.$remit_centrali = atom()
        this.$data.react(
            data => {
                let urlLinee220 = `http://${this.server}:${this.port}/api/remits/${data}/220`
                let urlLinee380 = `http://${this.server}:${this.port}/api/remits/${data}/380`
                let urlCentrali = `http://${this.server}:${this.port}/api/remits_centrali/${data}`
                this.getRemit(urlLinee220)
                this.getRemit(urlLinee380)
                this.getRemit(urlCentrali)
            },
            { skipFirst: true }
        )
    }

    dispatch(action, args) {
        this[action].apply(this, args || [])
        // requestAnimationFrame(function() {
        //     localStorage["transmission"] = JSON.stringify(this)
        // })
    }

    // hideSidebar(type) {
    //     if (type == "left") {
    //         this.sidebarLeft = false
    //     } else {
    //         this.sidebarRight = false
    //     }
    // }

    fetchCentrali() {
        // prettier-ignore
        m.request({ 
            method: "GET",
            url: `http://${this.server}:${this.port}/api/lista_centrali`,
        }).then(response => {
            this.$lista_centrali.set(response)
        }).catch(err => {
            console.log("Errore richiesta json lista centrali", err)
        })
    }

    getRemit(url) {
        // prettier-ignore
        m.request({
                method: "GET",
                url: url,
            })
            .then(response => {
                switch (url) {
                  case String(url.match(/.*remits_centrali.*/)):
                    this.$remit_centrali.set(response)
                    break
                  case String(url.match(/.*\/remits\/.*\/220/)):
                    this.$remit_220.set(response)
                    break
                  case String(url.match(/.*\/remits\/.*\/380/)):
                    this.$remit_380.set(response)
                    break
                  default:
                    console.log("Didn't match")
                    break
                }
                
            })
            .catch(err => {
                console.log(`Errore richiesta json remit  ${url}`, err)
            })
    }
}

window.appState = new App()

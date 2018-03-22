// src/model/app.js

import stream from "mithril/stream"

class App {
    constructor() {
        this._modelName = this.constructor.name
        this.sidebarLeft = false
        this.sidebarRight = false
        this.server = window.location.hostname
        this.port = process.env.NODE_ENV == "production" ? 80 : 9292
        this.data = stream()
        this.remit_380 = this.data.map(value => this.fetchRemit("380"))
        this.remit_220 = this.data.map(value => this.fetchRemit("220"))
        this.remit_centrali = this.data.map(value => this.fetchRemitCentrali())
        this.selectLine = stream()
        this.selectCentrale = stream()
        this.remit_380_visibility = stream(true)
        this.remit_220_visibility = stream(true)
        this.termico_visibility = stream(true)
        this.eolico_visibility = stream(true)
        this.idrico_visibility = stream(true)
        this.autoprod_visibility = stream(true)
        this.solare_visibility = stream(true)
        this.pompaggi_visibility = stream(true)
        this.geotermico_visibility = stream(true)
        this.lista_centrali = stream(this.fetchCentrali())
        this.selectSocieta = stream([])
        this.selectUnita = stream([])
        this.societa_visibility = stream([])
        this.unita_visibility = stream([])

        // this.remit_centrali.map(value => console.dir(value))
    }

    dispatch(action, args) {
        this[action].apply(this, args || [])
        // requestAnimationFrame(function() {
        //     localStorage["transmission"] = JSON.stringify(this)
        // })
    }

    toggleSidebar(type) {
        if (type == "left") {
            this.sidebarLeft ? (this.sidebarLeft = false) : (this.sidebarLeft = true)
        } else {
            this.sidebarRight ? (this.sidebarRight = false) : (this.sidebarRight = true)
        }
    }

    hideSidebar(type) {
        if (type == "left") {
            this.sidebarLeft = false
        } else {
            this.sidebarRight = false
        }
    }

    fetchRemit(volt) {
        m
            .request({
                method: "GET",
                url: `http://${this.server}:${this.port}/api/remits/${this.data()}/${volt}`,
            })
            .then(response => {
                volt == "380" ? this.remit_380(response) : this.remit_220(response)
            })
            .catch(err => {
                console.log(`Errore richiesta json linee ${volt}`, err)
            })
    }

    fetchRemitCentrali() {
        m
            .request({
                method: "GET",
                url: `http://${this.server}:${this.port}/api/remits_centrali/${this.data()}`,
            })
            .then(response => {
                this.remit_centrali(response)
            })
            .catch(err => {
                console.log("Errore richiesta json remit  centrali", err)
            })
    }

    fetchCentrali() {
        m
            .request({
                method: "GET",
                url: `http://${this.server}:${this.port}/api/lista_centrali`,
            })
            .then(response => {
                this.lista_centrali(response)
            })
            .catch(err => {
                console.log("Errore richiesta json lista centrali", err)
            })
    }

    setData(data) {
        this.data(data)
    }

    clickTableLine(line) {
        this.selectLine(line)
    }

    clickTableCentrale(centrale) {
        this.selectCentrale(centrale)
    }
}

window.appState = new App()

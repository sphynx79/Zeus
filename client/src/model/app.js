// src/model/app.js

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
        // toggle visibility tecnologia
        this.$termico_visibility = atom(true)
        this.$eolico_visibility = atom(true)
        this.$idrico_visibility = atom(true)
        this.$autoprod_visibility = atom(true)
        this.$solare_visibility = atom(true)
        this.$pompaggi_visibility = atom(true)
        this.$geotermico_visibility = atom(true)
        // sincronizzare i filtri
        this.$lista_centrali = atom(this.fetchCentrali())
        this.$filterSottotipo = derive(() => this.filterTecnologia())
        this.$selectSottotipo = atom([])
        this.$filterSocieta = derive(() => this.filterUnita(this.$filterSottotipo.get(), this.$selectSottotipo.get(), "sottotipo"))
        this.$selectSocieta = atom([])
        this.$filterUnita = derive(() => this.filterUnita(this.$filterSocieta.get(), this.$selectSocieta.get(), "company"))
        this.$selectUnita = atom([])
        this.$unitaVisibility = derive(() => this.filterUnita(this.$filterUnita.get(), this.$selectUnita.get(), "etso"))
        this.$etsoVisibility = derive(() => this.$unitaVisibility.get().map(item => item["etso"]))
        // gestione remit
        this.$remit_220 = atom()
        this.$remit_380 = atom()
        this.$remit_centrali = atom()
        this.$remitCentraliFiltered = derive(() => this.filterRemitCentrali())
        // TODO: spostare questa parte nel component datapicker
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
        return this[action].apply(this, args || [])
        // requestAnimationFrame(function() {
        //     localStorage["transmission"] = JSON.stringify(this)
        // })
    }

    filterTecnologia() {
        let select = []
        this.$termico_visibility.get() && select.push("TERMICO")
        this.$eolico_visibility.get() && select.push("EOLICO")
        this.$idrico_visibility.get() && select.push("IDRICO")
        this.$autoprod_visibility.get() && select.push("AUTOPRODUTTORE")
        this.$solare_visibility.get() && select.push("SOLARE")
        this.$pompaggi_visibility.get() && select.push("POMPAGGIO")
        this.$geotermico_visibility.get() && select.push("GEOTERMICO")
        return this.$lista_centrali.get().filter(item => select.includes(item["tipo"]))
    }

    filterUnita(filterValue, select, type) {
        return filterValue.filter(item => (select.length == 0 ? true : select.includes(item[type])))
    }

    filterRemitCentrali() {
        let remit = this.$remit_centrali.get()
        if (remit === undefined) {
            return undefined
        }
        return remit.features.filter(item => this.$etsoVisibility.get().includes(item.properties.nome))
    }

    parseFilter(items, type) {
        let unique = [...new Set(items.map(item => item[type]))]
        let selectItems = unique.map(item => new Object({ value: item, text: item }))
        return selectItems
    }

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

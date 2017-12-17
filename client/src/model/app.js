// import stream  from 'mithril/stream'

class App {

    constructor() {
        this._modelName = this.constructor.name
        this.sidebar    = false
        this.server     = window.location.hostname
        this.remit      = null
    }

    dispatch(action, args) {
        this[action].apply(this, args || [])
        requestAnimationFrame(function() {
            localStorage["transmission"] = JSON.stringify(this)
        })
    }

    toggleSidebar() {
        this.sidebar ? this.sidebar = false : this.sidebar = true
    }

    hideSidebar() {
        this.sidebar = false
    }

    loadRemit() {
        m.request({
            method: "GET",
            url: `http://${this.server}:9292/api/remits/07-12-2017`,
            // url: "http://192.168.0.102:9292/api/remits/07-12-2017",
        })
          .then(response => {this.remit = response})
          .catch(err     => {console.log("Errore richiesta json linee 380", err)}
          )
    }

}

window.appState = new App()


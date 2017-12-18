import stream  from 'mithril/stream'

class App {

    constructor() {
        this._modelName = this.constructor.name
        this.sidebar    = false
        this.server     = window.location.hostname
        this.data       = stream()
        this.remit      = this.data.map(value => this.fetchRemit(value))
        this.selectLine = stream()
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

    fetchRemit(data) {
        m.request({
            method: "GET",
            url: `http://${this.server}:9292/api/remits/${this.data()}`,
            // url: "http://192.168.0.102:9292/api/remits/07-12-2017",
        })
          .then(response => {this.remit(response)})
          .catch(err     => {console.log("Errore richiesta json linee 380", err)}
          )
    }

    setData(data) {
        this.data(data)
    }

    clickLine(line) {
        this.selectLine(line)
    }
    
}

window.appState = new App()


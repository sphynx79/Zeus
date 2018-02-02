import stream  from 'mithril/stream'

class App {

    constructor() {
        this._modelName = this.constructor.name
        this.sidebar    = false
        this.server     = window.location.hostname
        this.data       = stream()
        this.remit_380  = this.data.map(value => this.fetchRemit("380"))
        this.remit_220  = this.data.map(value => this.fetchRemit("220"))
        this.selectLine = stream()
    }

    dispatch(action, args) {
        this[action].apply(this, args || [])
        // requestAnimationFrame(function() {
        //     localStorage["transmission"] = JSON.stringify(this)
        // })
    }

    toggleSidebar() {
        this.sidebar ? this.sidebar = false : this.sidebar = true
    }

    hideSidebar() {
        this.sidebar = false
    }

    fetchRemit(volt) {
        m.request({
            method: "GET",
            url: `http://${this.server}:9292/api/remits/${this.data()}/${volt}`,
        })
          .then(response => {
              volt == "380" ? this.remit_380(response) : this.remit_220(response)
          })
          .catch(err => {console.log(`Errore richiesta json linee ${volt}`, err)}
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


import stream  from 'mithril/stream'

var state = {

    dispatch: (action, args) => {
        state[action].apply(state, args || [])
        requestAnimationFrame(function() {
            localStorage["transmission"] = JSON.stringify(state)
        })
    },

    sidebar: false,
    server: window.location.hostname,
    remit: {},

    toggleSidebar: () => {
        state.sidebar ? state.sidebar = false : state.sidebar = true
    },

    hideSidebar: () => {
        state.sidebar = false
    },

    loadRemit: () => {
        m.request({
            method: "GET",
            url: `http://${state.server}:9292/api/remits/07-12-2017`,
            // url: "http://192.168.0.102:9292/api/remits/07-12-2017",
        })
          .then(result => {state.remit = result})
          .catch(err    => {console.log("Errore richiesta json linee 380", err)}
          )
    }

}

window.appState = state


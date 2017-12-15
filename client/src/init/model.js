var state = {

    dispatch: (action, args) => {
        state[action].apply(state, args || [])
        requestAnimationFrame(function() {
            localStorage["transmission"] = JSON.stringify(state)
        })
    },

    sidebar: false,

    toggleSidebar: () => {
        state.sidebar ? state.sidebar = false : state.sidebar = true
    },

    hideSidebar: () => {
        state.sidebar = false
    }

}

window.appState = state


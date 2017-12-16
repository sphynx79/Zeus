// src/components/layout/layout.js

import "./layout.css";

class Layout {

    constructor() {
        this._componentName = this.constructor.name
    }

    _toggleSideBar(){
        appState.dispatch("toggleSidebar")
    }

    _hideSideBar(){
        appState.dispatch("hideSidebar")
    }

    view({attrs, state}) {
        return m("#layout", [
            m(attrs.sidebar, {class: (appState.sidebar ? "active" : "") + " " }),
            m(attrs.burger, {class: (appState.sidebar ? "active" : "") + " ", onclick: () => {state._toggleSideBar()}}),
            m(attrs.remitTransmission, {onclick: () => {state._hideSideBar()}}),
        ])
    }

    oncreate({attrs, state}) {
        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default Layout

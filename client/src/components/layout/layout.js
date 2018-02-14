// src/components/layout/layout.js

import "./layout.css";

class Layout {

    constructor() {
        this._componentName = this.constructor.name
    }

    _toggleSideBar(type){
        appState.dispatch("toggleSidebar", [type])
    }

    _hideSideBar(){
        appState.sidebarLeft  && appState.dispatch("hideSidebar", ['left'])
        appState.sidebarRight && appState.dispatch("hideSidebar", ['right'])
    }

    view({attrs, state}) {
        return m("#layout", [
            m(attrs.sidebarLeft,  {class: (appState.sidebarLeft ? "active" : "") + " " + "left" , type: "left" }),
            m(attrs.burgerLeft,   {class: (appState.sidebarLeft ? "active" : "") + " " + "left" ,onclick: () => {state._toggleSideBar("left")}}),
            m(attrs.sidebarRight, {class: (appState.sidebarRight ? "active" : "") + " "+ "right", type: "right" }),
            m(attrs.burgerRight,  {class: (appState.sidebarRight ? "active" : "") + " " + "right", onclick: () => {state._toggleSideBar("right")}}),
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

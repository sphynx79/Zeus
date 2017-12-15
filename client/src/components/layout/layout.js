// src/components/layout/layout.js

import "./layout.css";

class Layout {

    constructor() {
        this._componentName = this.constructor.name
    }

    _initState() {
        this.sidebarIsActive = ''
    }

    _initAction() {
        this.action = (action) => {
            switch (action) {
                case "TOGGLE_SIDEBAR": return (() => { this._toggle() })() ;
                case "HIDE_SIDEBAR":   return (() => { this._hide()   })() ;
            }
        }
    }

    // _initGlobalAction() {
    //     receive("HIDE_SIDEBAR",   () => this.action("HIDE_SIDEBAR") )
    // }

    _toggle() {
        this.sidebarIsActive === 'active' ? this.sidebarIsActive = '' :  this.sidebarIsActive = 'active'
    }

    _hide() {
        if(this.sidebarIsActive == 'active'){this.sidebarIsActive = ''}
    }

    oninit(){
        this._initState()
        this._initAction()
        // this._initGlobalAction()
    }

    view({attrs, state}) {
        return m(".layout", [
            m(attrs.sidebar, {class: state.sidebarIsActive }),
            m(attrs.burger, {class: state.sidebarIsActive, onclick: () => { this.action("TOGGLE_SIDEBAR")}}),
            m(attrs.remitTransmission, {onclick: () => {this.action("HIDE_SIDEBAR")}}),
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

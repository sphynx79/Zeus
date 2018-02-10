// src/components/remit_transmission/remit_transmission.js

import "./remit_transmission.css"
import MapBox from "components/mapbox/mapbox.js"
import stream  from 'mithril/stream'

class RemitTransmission {

    constructor(vnode) {
        this._componentName = this.constructor.name
    }

    // _fetchRemit() {
    //     appState.dispatch("fetchRemit")
    // }

    oninit({state}) {
        // state._fetchRemit()
    }

    view({attrs}) {
        return m('#main', attrs, m(MapBox))
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

export default RemitTransmission

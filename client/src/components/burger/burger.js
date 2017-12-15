// src/components/burger/burger.js

import "./burger.css"

class Burger {

    constructor(vnode) {
        this._componentName = this.constructor.name
    }

    view({attrs}){
        return m('#burger', attrs, [m('#top'), m('#middle'), m('#bottom')])
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

export default Burger


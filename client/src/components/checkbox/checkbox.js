// src/components/checkbox/checkbox.js

import "./checkbox.css"

class CheckBox {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view({ attrs }) {
        // prettier-ignore
        return m(".bx--checkbox-wrapper", [
            m(`input.bx--checkbox[id='${attrs.id}'][name='checkbox'][type='checkbox']`, {
                checked: attrs.checked,
                onchange: attrs.onchange,
            }),
            m(`label.bx--checkbox-label[for='${attrs.id}']`, attrs.label),
        ])
    }

    oncreate({ attrs, state }) {
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default CheckBox

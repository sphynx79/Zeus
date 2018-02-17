// src/components/checkbox/checkbox.js

class CheckBox {

    constructor() {
        this._componentName = this.constructor.name
    }

    view({attrs}){
        return m(".bx--form-item.bx--checkbox-wrapper", [
            m(`input.bx--checkbox[id='${attrs.id}'][name='checkbox'][type='checkbox']`,  {
                checked:  attrs.checked,
                onchange: attrs.onchange
            }),
            m(`label.bx--checkbox-label[for='${attrs.id}']`, attrs.label)
        ])
    }

    oncreate({attrs, state}) {
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default CheckBox


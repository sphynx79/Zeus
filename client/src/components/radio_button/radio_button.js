// src/components/radio_button/radio_button.js

class RadioButton {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view({ attrs }) {
        // prettier-ignore
        return m("div", [
                    m(`input.bx--radio-button[checked='${attrs.checked}']${attrs.state}[id='${attrs.id}'][name='radio-button'][tabindex='0'][type='radio'][value='${attrs.label}']`), 
                    m(`label.bx--radio-button__label[for='${attrs.id}']`,[
                        m("span.bx--radio-button__appearance"), attrs.label
                    ])]
        )
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

export default RadioButton

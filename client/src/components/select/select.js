// src/components/select/select.js

import "./select.scss"
const Selectr = require("imports-loader?this=>window,define=>false!mobius1-selectr/dist/selectr.min.js")

class Select {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    view({ attrs }) {
        // prettier-ignore
        return m("select")
    }

    oncreate(vnode) {
        let el = vnode.dom

        vnode.select = new Selectr(el, {
            searchable: true,
            multiple: true,
            clearable: true,
            defaultSelected: false,
            closeOnScroll: false,
            placeholder: vnode.attrs.placeholder,
            data: vnode.attrs.data.get(),
            customClass: "custom-style",
            width: 500,
        })

        let elId = document.querySelector(`${vnode.attrs.id}`)

        vnode.select.on("selectr.open", () => {
            elId && elId.style.setProperty("--space", "16rem")
        })

        vnode.select.on("selectr.close", () => {
            elId && elId.style.setProperty("--space", "4rem")
        })

        vnode.select.on("selectr.change", option => {
            let options = vnode.select.getValue()
            vnode.attrs.onchange(options)
        })
        // let elSelect = elId.querySelector(".selectr-selected")
        // elSelect.addEventListener('focus', () => vnode.select.open());

        vnode.attrs.data.react(value => {
            vnode.select.clear()
            vnode.select.removeAll()
            vnode.select.add(value)
        })

        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default Select

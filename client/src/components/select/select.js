// src/components/select/select.js

import "./select.scss"
const Selectr = require("imports-loader?this=>window,define=>false!mobius1-selectr/src/selectr.js");

class Select {

    constructor() {
        this._componentName = this.constructor.name
    }

    view({attrs}){
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
            data: vnode.attrs.data(),
            customClass: "custom-style",
            width: 500,
        })


        vnode.select.on("selectr.open", () => {
           let el = document.querySelector(`${vnode.attrs.id}`)
           el && el.style.setProperty("--space", "16rem")
	
        })

        vnode.select.on("selectr.close", () => {
            let el = document.querySelector(`${vnode.attrs.id}`)
            el && el.style.setProperty("--space", "4rem")
        })

        vnode.select.on("selectr.change", (option) => {
            let options = vnode.select.getValue()
            vnode.attrs.onchange(options)
        })

        
        vnode.attrs.data.map(value => {
           vnode.select.removeAllOption()
           vnode.attrs.data() && vnode.attrs.data().map(value => vnode.select.add(value) )
        })

        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
    
    // RenderOption(option) {
    //  let template = [`<span class="name">${option.text}</span>
    //                   <svg class="icon icon-checkmark" width="64" height="48" viewBox="0 0 64 48">
    //                   <path d="M21.867 32.533l-14.4-14.4-7.467 8 21.867 21.867 40.533-40.533-7.467-7.467z"></path>
    //                   </svg>
    //                 `]
    //  return template
    // }

}

export default Select


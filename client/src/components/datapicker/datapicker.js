// src/components/datapicker/datapicker.js

import "./datapicker.css";
import pikaday from'pikaday'


class DataPicker {

    constructor() {
        this._componentName = this.constructor.name
    }

    view(vnode) {
        // return m('input.datepicker', {placeholder: 'Data'})
        return m("div", m("label", {style: {"position": "relative"}},[
                 m("i.calendar.fa.fa-calendar[aria-hidden='true']"),
                 m("input[id='datepicker'][placeholder='Data'][type='text']")
                ]
            )
        )
    }

    oncreate(vnode) {
        console.log(vnode.dom.lastChild.lastElementChild)
        vnode.picker = new pikaday({
            field: vnode.dom.lastChild.lastElementChild,
            format: 'D-M-YYYY',
            theme: 'dark-theme',
            onSelect: (date) => {
                // vnode.attrs.setValue(date)
            }
        })


        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }


}



export default DataPicker

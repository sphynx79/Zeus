// src/components/datapicker/datapicker.js

import "./datapicker.css";
import pikaday from'pikaday'


class DataPicker {

    constructor() {
        this._componentName = this.constructor.name
    }

    _setData(data) {
        appState.dispatch("setData", [data])
    }

    oninit({state}) {
        let data      = new Date();
        let tomorrow  = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate() + 1}`
        state._setData(tomorrow)
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
        vnode.picker  = new pikaday({
            field: vnode.dom.lastChild.lastElementChild,
            format: 'D-M-YYYY',
            theme: 'dark-theme',
            defaultDate: new Date(appState.data),
            setDefaultDate: true,
            onSelect: (date) => {
                let day   = date.getDate()
                let month = date.getMonth() + 1
                let year  = date.getFullYear()
                let data  = `${day}-${month}-${year}`
                vnode.state._setData(data)
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

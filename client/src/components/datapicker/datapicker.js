// src/components/datapicker/datapicker.js

import "./datapicker.css"
import DatePicker from "carbon_component/date-picker/date-picker.js"
import calendarIcon from "./calendarIcon.js"

class DataPicker {
    constructor() {
        this._componentName = this.constructor.name
    }

    _setData(data) {
        appState.dispatch("setData", [data])
    }

    oninit({ state }) {
        let data = new Date()
        data.setDate(data.getDate() + 1)
        let tomorrowStr = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`
        state._setData(tomorrowStr)
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m(".bx--form-item", [
            m(".bx--date-picker.bx--date-picker--single[data-date-picker=''][data-date-picker-type='single']",
                m(".bx--date-picker-container", [
                    m(calendarIcon),
                    m("input.bx--date-picker__input[data-date-picker-input=''][id='date-picker'][pattern='d{1,2}/d{1,2}/d{4}'][placeholder='dd/mm/yyyy'][type='text']"),
                    m(".bx--form-requirement", "Invalid date format."),
                ])
            ),
        ])
    }

    oncreate(vnode) {
        let el = vnode.dom.lastChild

        vnode.picker = DatePicker.create(el, {
            dateFormat: "d-m-Y",
            defaultDate: new Date(appState.data),
        })

        vnode.picker.calendar.config.onChange.push((selectedDates, dateStr, instance) => {
            vnode.state._setData(dateStr)
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

export default DataPicker

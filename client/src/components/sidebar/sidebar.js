// src/components/sidebar/sidebar.js

import "./sidebar.css"
import Button from "components/button/button.js"
import DataPicker from "components/datapicker/datapicker.js"
import Table from "components/table/table.js"

class SideBar {

    constructor() {
        this._componentName = this.constructor.name
        // this.navItems = [
        //     {
        //         label: 'Home',
        //         href: '/'
        //     },
        //     {
        //         label: 'About',
        //         href: '/about'
        //     },
        //     {
        //         label: 'Contact',
        //         href: '/contact'
        //     }
        // ]
    }

    view({attrs}) {
        // return m('nav#sidebar', attrs, [
        //     m('ul', this.navItems.map((item) => {return m(Button, {class: 'nav-item',href: item.href}, item.label)})),
        // ])
        return m('nav#sidebar', attrs, [m(DataPicker), m(Table)])
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

export default SideBar

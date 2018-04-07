// src/components/legend/legend.js

import "./legend.scss"
import Tile from "carbon_component/tile/tile.js"

class Leggend {
    constructor() {
        this._componentName = this.constructor.name
        this._legendItem = [
            { label: "Linee 380", color: "#7FCED8", class: "legend__key--linee" },
            { label: "Linee 220", color: "#9B02A3", class: "legend__key--linee" },
            { label: "Tecnologia Termico", color: "#E30202", class: "legend__key--tecno" },
            { label: "Tecnologia Eolico", color: "#7202E0", class: "legend__key--tecno" },
            { label: "Tecnologia Idrico", color: "#03A8A8", class: "legend__key--tecno" },
            { label: "Tecnologia Autoproduttore", color: "#CB689A", class: "legend__key--tecno" },
            { label: "Tecnologia Solare", color: "#CB6203", class: "legend__key--tecno" },
            { label: "Tecnologia Pompaggi", color: "#03D838", class: "legend__key--tecno" },
            { label: "Tecnologia Geotermico", color: "#643201", class: "legend__key--tecno" },
        ]
    }

    view({ attrs }) {
        // prettier-ignore
        return m(".legend.map-overlay.bx--tile.bx--tile--expandable[data-tile='expandable'][tabindex='0']", [
            m("button.bx--tile__chevron",
                m("svg[fill-rule='evenodd'][height='8'][viewBox='0 0 12 8'][width='12']", m("path[d='M1.4 7.5L6 2.8l4.6 4.7L12 6.1 6 0 0 6.1z']"))
            ),
            m(".bx--tile-content", [
                m("span.bx--tile-content__above-the-fold.legend__head.bx--type-zeta[data-tile-atf='Legenda']", "LEGENDA"),
                this._legendItem.map(value => {
                    let style = value.class == "legend__key--linee" ? { style: { "background-color": value.color } } : { style: { "border-color": value.color } }
                    return m(".legend__item", [
                        m(`span.bx--tile-content__below-the-fold.legend__key.${value.class}`, style),
                        m(".legend__item__label.bx--type-omega", value.label),
                    ])
                }),
            ]),
        ]
        )
    }

    oncreate(vnode) {
        let el = vnode.dom
        vnode.tile = Tile.create(el)
        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: vnode.attrs,
                state: vnode.state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default Leggend

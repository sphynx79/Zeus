// src/components/table/table.js

import "./tablecentrali.scss"
import { derive } from "derivable"
import Tabulator from "tabulator-tables"
// import SimpleBar from "SimpleBar"
import "simplebar"

class TableCentrali {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
    }

    oninit({ attrs, state }) {
        state.tabulator = null
        state.tableData = null
        state.type = attrs.type
        state.titolo = "CENTRALI"
        state.activeLine = -1
        appState.$data.react(() => (state.activeLine = -1))
    }

    view({ attrs, state }) {
        // prettier-ignore
        return m(".tbl", [ 
                m(".tbl__header", "CENTRALI"),,
                m("#table_centrali.table")
                ])
    }

    oncreate(vnode) {
        var el = vnode.dom.children[1]

        vnode.state.tabulator = new Tabulator(el, {
            height: "210px",
            layout: "fitColumns",
            resizableColumns: false,
            // data: vnode.state.tableData,
            placeholder: "No Data Set",
            columns: [
                {
                    field: "fold",
                    visible: true,
                    resizable: false,
                    // editor: true,
                    headerSort: false,
                    align: "center",
                    width: 26,
                    minWidth: 26,
                    cellClick: (e, cell) => {
                        var cellValue = cell.getValue()
                        var cellEl = cell.getElement()
                        if (cell.getValue() == false) {
                            cell.getRow().getElement().lastElementChild.style.display = "none"
                        } else {
                            cell.getRow().getElement().lastElementChild.style.display = ""
                        }
                        cell.setValue(!cellValue, true)
                    },
                    formatter: (cell, formatterParams, onRendered) => {
                        if (cell.getValue() == true) {
                            return "<svg width='10' height='5' viewBox='0 0 10 5'><path d='M0 0l5 4.998L10 0z'></path></svg>"
                        } else {
                            return "<svg width='10' height='5' viewBox='0 0 10 5'><path d='M0 5L5 .002 10 5z'></path></svg>"
                        }
                    },
                },
                {
                    title: "Nome",
                    field: "nome",
                    // headerFilter: true,
                    // width: 100,
                },
                {
                    title: "Company",
                    field: "company",
                    // headerFilter: true,
                    // width: 100,
                },
                {
                    title: "Tipo",
                    field: "tipo",
                    // headerFilter: true,
                    // width: 100,
                },
                {
                    title: "Sottotipo",
                    field: "sottotipo",
                    // headerFilter: true,
                    // width: 150,
                },
                {
                    title: "Update",
                    field: "update",
                    // headerFilter: true,
                    // width: 150,
                },
                {
                    title: "Start",
                    field: "start",
                    // headerFilter: true,
                    // width: 150,
                },
                {
                    title: "End",
                    field: "end",
                    // headerFilter: true,
                    // width: 150,
                },
            ],

            rowFormatter: row => {
                let element = row.getElement()
                let width = element.offsetWidth - 40
                let data = row.getData()
                let { hours, ...field } = data
                let hoursRow

                // prettier-ignore
                var table =  m(".table" , { style: { "display": "none", "cursor": "auto" } } ,
                  m(".hours-row.bx--type-legal", { style: { "padding-left": "25px" } }, Object.keys(hours).map((key) => { 
                      return m(".tabulator-cell", {style: {"width": `${(width / 24)+0.6}px`, "height": "20px", "text-align": "center"}},
                          [ `${key}`,
                          ]
                        )
                  })), 
                  m(".hours-row.bx--type-legal", { style: { "padding-left": "25px" , "cursor": "auto" } }, Object.values(hours).map((value) => { 
                      return m(".tabulator-cell", {style: {"width": `${(width / 24)+0.6}px`, "height": "20px", "text-align": "center"}},
                          [ `${value | 0}`,
                          ]
                        )
                  } ))
                )

                hoursRow = document.createElement("div")
                m.render(hoursRow, [table])

                element.append(hoursRow.firstChild)
            },

            rowClick: (e, row) => {
                console.log(e.target.tagName)
                console.log(e.target.firstElementChild)
                if (e.target.firstElementChild == null && e.target.tagName != "path") {
                    return appState.$selectCentrale.set(row.getData())
                }
            },
        })

        appState.$remitCentraliFiltered.react(r => {
            let remit = r.map(item => {
                let merged = { ...item["properties"], ...{ geometry: item["geometry"] } }
                return merged
            })
            this.tabulator.setData(remit)
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

export default TableCentrali

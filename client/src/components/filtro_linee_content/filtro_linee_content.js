// src/components/filtro_linee_content/filtro_linee_content.js
//
import stream  from 'mithril/stream'

class FiltroLineeContent {

    constructor() {
        this._componentName  = this.constructor.name
        this.option          = ["Linee 380", "Linee 220"]
        this.chekboxLinee220 = stream(true)
        this.chekboxLinee380 = stream(true)
    }

    oninit({attrs, state}) {

    }

    view({attrs,state}) {

        return m("fieldset.bx--fieldset",[
            this.option.map(value => {
                let checkBoxId ="bx--"+value.toLowerCase().replace(" ", "-")
                return  m(".bx--form-item.bx--checkbox-wrapper", [
                    m(`input.bx--checkbox[id='${checkBoxId}'][name='checkbox'][type='checkbox']`,  {
                        checked:  this.initialStateCheckbox(value),
                        onchange: (e) => {
                            this.toggleCheckBox(value) 
                   
                            e.target.id
                            dispatch("PROVA", e.target.id)
                        } 
                    }),
                    m(`label.bx--checkbox-label[for='${checkBoxId}']`, value)
                ])

            } )
        ])

    }

    toggleCheckBox(type){
        if (type == "Linee 380") {
            this.chekboxLinee380() ? this.chekboxLinee380(false) : this.chekboxLinee380(true) 
        } else { 
            this.chekboxLinee220() ? this.chekboxLinee220(false) : this.chekboxLinee220(true) 
        }

    }


    initialStateCheckbox(type) {
        if (type == "Linee 380") {
            return this.chekboxLinee380()
        } else { 
            return this.chekboxLinee220()
        }
    }

    oncreate({attrs,state}) {
        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default FiltroLineeContent

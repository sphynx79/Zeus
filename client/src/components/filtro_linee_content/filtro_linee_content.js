// src/components/filtro_linee_content/filtro_linee_content.js

class FiltroLineeContent {

    constructor() {
        this._componentName = this.constructor.name
        this.option         = ["Linee 380", "Linee 220"]
    }

    oninit({attrs, state}) {

    }

    view({attrs,state}) {
        
        return m("fieldset.bx--fieldset",[
            this.option.map(value => {
                let checkBoxId ="bx--"+value.toLowerCase().replace(" ", "-")
                return  m(".bx--form-item.bx--checkbox-wrapper", [
                    m(`input.bx--checkbox[id='${checkBoxId}'][name='checkbox'][type='checkbox']`, {onclick: () => {console.log("ciao")}}),
                    m(`label.bx--checkbox-label[for='${checkBoxId}']`, value)
                ])
       
            } )
        ])
           
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

// src/components/button/button  

import "./button.css"

class Button {
    view(vnode){
        const element = vnode.attrs.href ? 'a' : 'button'
        return m(element, vnode.attrs, vnode.attrs.text, vnode.children)
    }
}

export default Button

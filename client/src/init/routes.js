import Layout            from '../components/layout/layout'
import RemitTransmission from '../components/remit_transmission/remit_transmission'
import SideBar           from '../components/sidebar/sidebar.js'
import Burger            from "../components/burger/burger.js"

m.route.prefix('')

m.route(document.getElementById("app"), '/', {
    '/': {render: () => {return m(Layout,{sidebar: SideBar, burger: Burger, remitTransmission: RemitTransmission})}}
    })


export default class CalendarIcon {
    view(vnode) {
        return m.trust(
            '<svg data-date-picker-icon class="bx--date-picker__icon" width="17" height="19" viewBox="0 0 17 19"><path d="M12 0h2v2.7h-2zM3 0h2v2.7H3z" /><path d="M0 2v17h17V2H0zm15 15H2V7h13v10z" /><path d="M9.9 15H8.6v-3.9H7.1v-.9c.9 0 1.7-.3 1.8-1.2h1v6z" /></svg>'
        )
    }
}

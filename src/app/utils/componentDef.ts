import { Component, HostBinding } from "@angular/core";

@Component({
    template: ""
})
export class PagedComponent {
    @HostBinding('class') _boundHTMLClass = 'wfull hfull'
    constructor() {
    }
}

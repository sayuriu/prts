import { Component, HostBinding } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(public router: Router) {}
    @HostBinding('attr.entry') get isEntry() {
        return this.router.url === '/';
    }

    prepareOutlet(outlet: RouterOutlet)
    {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}

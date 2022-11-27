import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    initED = false;
    prepareOutlet(outlet: RouterOutlet)
    {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}

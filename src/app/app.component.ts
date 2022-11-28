import { Component, HostBinding } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { animate, query, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routeAnimations', [
            transition('* <=> *', [
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    })
                ], { optional: true }),
                query(':enter', [
                    style({ left: '-100%' })
                ], { optional: true }),
                query(':leave', [
                    style({ left: '0%' })
                ], { optional: true }),
                query(':enter', [
                    animate('0.5s ease-in-out', style({ left: '0%' }))
                ], { optional: true }),
                query(':leave', [
                    animate('0.5s ease-in-out', style({ left: '100%' }))
                ], { optional: true }),
            ]),
        ]),
    ]
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

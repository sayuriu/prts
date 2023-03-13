import { Component, HostBinding } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { animate, query, style, transition, trigger } from "@angular/animations";
import { absLateralAnimation, AnimFunctions } from "@utils/ng-anim";

const commonTransitionConfig = {
    durationSeconds: 0.6,
    ease: AnimFunctions.forceful,
    optional: true,
} as const;

const routeAnimations = [
    transition(
        '* => blank',
        absLateralAnimation("UD")(commonTransitionConfig)
    ),
    transition(
        'blank => *, * => main',
        absLateralAnimation("DU")(commonTransitionConfig)
    ),
    transition(
        '* <=> *',
        absLateralAnimation("LR")(commonTransitionConfig)
    ),
]

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routeAnimations', routeAnimations),
    ]
})
export class AppComponent {
    constructor(public router: Router) {
        this.router.urlUpdateStrategy = "eager";
    }
    @HostBinding('attr.entry') get isEntry() {
        return this.router.url === '/';
    }

    prepareOutlet(outlet: RouterOutlet)
    {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss'],
    animations: [
        trigger('slideRL', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate(300, style({ transform: 'translateX(0)' })),
            ]),
            transition(':leave', [
                animate(300, style({ transform: 'translateX(100%)' }))
            ])
        ])
    ],
})
export class TopBarComponent implements OnInit {

    constructor(public router: Router) {
    }

    logoPlacementMode = "entry";
    init = true;
    logoPlacementLock = "locked";

    ngOnInit(): void {
        if (window && window.location)
            this.logoPlacementMode = window.location.pathname === '/' ? "entry" : "nav";
        this.startRouteListener();
    }

    currentRouteURL!: string;
    startRouteListener()
    {
        this.currentRouteURL = this.router.url;
        // console.time('handleRouteChange');
        this.router.events.subscribe( evt => {
            const eventType = Object.getPrototypeOf(evt).constructor.name;
            console.log('handleRouteChange', this.currentRouteURL, eventType);
            // console.timeLog('handleRouteChange');
            if (eventType === 'ChildActivationEnd' && this.init)
            {
                this.logoPlacementMode = this.router.url === '/' ? "entry" : "nav";
                this.init = false;
            }
            if (this.router.url === this.currentRouteURL) return;
            this.currentRouteURL = this.router.url;
        });
    }

    UIVisible = this.currentRouteURL !== '/';
    async navigateTo(nextRoute: string)
    {
        await this.router.navigate([nextRoute]);
        if (nextRoute === '/')
        {
            this.UIVisible = false;
        }
    }

    log(...args: any[])
    {
        console.log(...args);
    }
    updateLogoPlacementMode()
    {
        console.log('updateLogoPlacementMode', this.currentRouteURL);
        this.logoPlacementMode = this.router.url === '/' ? "entry" : "nav";
        this.lockLogoPlacement();
    }

    lockLogoPlacement() { this.logoPlacementLock = "locked"; }
    unlockLogoPlacement() { this.logoPlacementLock = ""; }
}

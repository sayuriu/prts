import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
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

    constructor(public router: Router) { }

    ngOnInit(): void {
        this.startRouteListener();
    }

    currentRouteURL!: string;
    startRouteListener()
    {
        this.currentRouteURL = this.router.url;
        this.handleRouteChange(true);
        this.router.events.subscribe(evt => this.handleRouteChange(false, evt));
    }

    handleRouteChange(isInitial: boolean, evt?: any)
    {
        console.log('handleRouteChange', this.currentRouteURL, isInitial, evt);
        if (!isInitial && this.router.url === this.currentRouteURL) return;
        this.currentRouteURL = this.router.url;
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
}

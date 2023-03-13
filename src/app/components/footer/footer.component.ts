import { Component, HostBinding, OnInit } from '@angular/core';
import { animate, BezierDefinition } from 'motion';
import { AnimFunctions } from "@utils/ng-anim";
import { Router } from "@angular/router";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    @HostBinding('class') _boundHTMLClass = 'rel wfull hfull flex flex-ai-c';

    _betaBadgeViewBoxYMul = 0;
    isEntry = true;

    constructor(private router: Router) {

    }

    ngOnInit(): void {
        this.updateBetaBadgeViewBoxYMul();
        this.router.events.subscribe((value) => {
            if (Object.getPrototypeOf(value).constructor.name === "NavigationEnd")
                this.updateBetaBadgeViewBoxYMul()
        });
    }

    updateBetaBadgeViewBoxYMul()
    {
        const nextState = this.router.url === '/';
        if (nextState === this.isEntry) return;
        this.isEntry = nextState;
        animate(
            (progress) => this._betaBadgeViewBoxYMul = this.isEntry ? 1 - progress : progress,
            {
                easing: AnimFunctions.forceful as BezierDefinition,
                delay: this.isEntry ? 0 : 1.2,
            }
        )
    }
}

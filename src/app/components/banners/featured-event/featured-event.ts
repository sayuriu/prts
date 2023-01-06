import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-featured-event',
    templateUrl: './featured-event.html',
    styleUrls: ['./featured-event.scss']
})
export class FeaturedEvent implements OnInit {

    constructor() { }
    eventType!: "MAIN_STORY"
        | "INTERMEZZI"
        | "SIDE_STORY"
        | "SUPPLIES"
        | "ANNIHILATION"
        | "STATIONARY_SEC"
        | "CONTINGENCY_CONTRACT"
        | "INTEGRATED_STRATEGIES";

    ends!: number;
    name!: string;

    ngOnInit(): void {
    }

}

import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'app-featured-event',
    templateUrl: './featured-event.html',
    styleUrls: ['./featured-event.scss']
})
export class FeaturedEvent implements OnInit {

    constructor() { }
    @Input() eventType!: "MAIN_STORY"
        | "INTERMEZZI"
        | "SIDE_STORY"
        | "SUPPLIES"
        | "ANNIHILATION"
        | "STATIONARY_SEC"
        | "CONTINGENCY_CONTRACT"
        | "INTEGRATED_STRATEGIES";

    @Input() ends!: number;
    @Input() name!: string;
    @Input() server!: string;
    @Input() id!: string;
    @Input() bannerIMG!: string;

    ngOnInit(): void {
    }

}

import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FeaturedEvent } from "@struct/featured";


@Component({
    selector: 'featured-event',
    templateUrl: './featured-event.component.html',
    styleUrls: ['./featured-event.component.scss']
})
export class FeaturedEventComponent implements OnInit, FeaturedEvent {

    @HostBinding('class') _boundHTMLClass = 'hfull rel'
    constructor() { }
    @Input() eventType!: FeaturedEvent['eventType'];

    @Input() ends!: number;
    @Input() name!: string;
    @Input() server!: string;
    @Input() id!: string;
    @Input() bannerIMG!: string;

    ngOnInit(): void {
    }

}

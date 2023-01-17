import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FeaturedGacha } from "@struct/featured";

@Component({
  selector: 'gacha-banner',
  templateUrl: './gacha.component.html',
  styleUrls: ['./gacha.component.scss']
})
export class GachaComponent implements OnInit, FeaturedGacha {

    constructor() { }
    @HostBinding('class') _boundHTMLClass = 'wfull grid rel'

    @Input() bannerIMG!: string;
    @Input() id!: string;
    @Input() characters!: FeaturedGacha['characters'];
    @Input() server!: string;
    @Input() ends!: number;
    @Input() name!: string;

    ngOnInit(): void {
    }

}

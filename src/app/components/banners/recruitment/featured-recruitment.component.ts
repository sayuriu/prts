import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { FeaturedGacha } from "@struct/featured";
import { } from "motion"

/**
 * TODO
 * Animate to new state
 * Calulate post state
 * Animation bound rect
 * @use ng/anim, motion
 * */


class HasHoverWidgetSingleton<T> {
    constructor(public data: T) {
    }

    translate = "0";
    offset = "";
    axis = "x"
    display = false;
    hover(translate: (string | number)[]) {
        this.translate = translate.join(" ");
        this.display = true;
    }
    dehover()
    {
        this.display = false;
        // this.translateRelative = [this.translateRelative[0], `calc(${this.translateRelative[1]} + )`]
    }

}


@Component({
  selector: 'recruitment-banner',
  templateUrl: './featured-recruitment.component.html',
  styleUrls: ['./featured-recruitment.component.scss']
})
export class FeaturedRecruitmentComponent implements OnInit, FeaturedGacha {

    constructor(public htmlRef: ElementRef) { }
    @HostBinding('class') _boundHTMLClass = 'wfull grid rel'

    @Input() bannerIMG!: string;
    @Input() id!: string;
    @Input() characters!: FeaturedGacha['characters'];
    @Input() server!: string;
    @Input() ends!: number;
    @Input() name!: string;

    @Input() @HostBinding('style.background') mainColor!: string;
    @Input() accentColor!: string;

    ngOnInit(): void {
    }

}

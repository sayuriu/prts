import { Component, HostBinding, OnInit } from '@angular/core';
import { FeaturedEvent, FeaturedGacha } from "@struct/featured";
import { PagedComponent } from "@utils/componentDef";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends PagedComponent implements OnInit {
    featuredData: [FeaturedGacha[], FeaturedEvent[]] = [[
        {
            ends: Date.now() + 100000,
            name: "Abyss\nCorrosion",
            server: "EN",
            bannerIMG: "banner.png",
            id: "abyss_corrosion",
            mainColor: '#1660B7',
            accentColor: '#165AAA',
            characters: [
                {
                    name: "Specter the Unchained",
                    id: "1_spec",
                    main: true,
                    rarity: 5,
                    profileUrl: "spector.png"
                },
                {
                    name: "Irene",
                    id: "2_irene",
                    main: true,
                    rarity: 5,
                    profileUrl: "irene.png"
                },
                {
                    name: "Windflit",
                    id: "3_windflit",
                    main: true,
                    rarity: 4,
                    profileUrl: "wind.png"
                },
                {
                    name: "Skadi the Corrupting Heart",
                    id: "4_skadi2",
                    main: false,
                    rarity: 5,
                    profileUrl: "skadi2.png"
                },
                {
                    name: "Rosmontis",
                    id: "5_ros",
                    main: false,
                    rarity: 5,
                    profileUrl: "ros.png"
                },
                {
                    name: "W",
                    id: "6_w",
                    main: false,
                    rarity: 5,
                    profileUrl: "w.png"
                }
            ]
        },
    ], [
        {
            ends: Date.now() + 100000,
            name: "Stultifera Navis",
            eventType: "MAIN_STORY",
            server: "EN",
            bannerIMG: "banner.png",
            id: "stultifera_navis"
        }
    ]];
    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}

export interface FeaturedEvent {
    eventType: "MAIN_STORY"
        | "INTERMEZZI"
        | "SIDE_STORY"
        | "SUPPLIES"
        | "ANNIHILATION"
        | "STATIONARY_SEC"
        | "CONTINGENCY_CONTRACT"
        | "INTEGRATED_STRATEGIES";
    ends: number;
    name: string;
}

export interface FeaturedGacha {
    BannerIMG: string;
    characters: SimplifiedCharData[];
    id: string,
    server: string;
    name: string;
    ends: number;
}

interface SimplifiedCharData {
    name: string;
    id: string;
    rarity: number;
    main: boolean;
    profileUrl: string;
}


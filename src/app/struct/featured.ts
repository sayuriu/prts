interface FeaturedEventMetadata {
    id: string;
    server: string;
    name: string;
    ends: number;
    bannerIMG: string;
}

interface ColorMetadata {
    mainColor: string;
    accentColor: string;
}

export interface FeaturedEvent extends FeaturedEventMetadata {
    eventType: "MAIN_STORY"
        | "INTERMEZZI"
        | "SIDE_STORY"
        | "SUPPLIES"
        | "ANNIHILATION"
        | "STATIONARY_SEC"
        | "CONTINGENCY_CONTRACT"
        | "INTEGRATED_STRATEGIES";
}

export interface FeaturedGacha extends FeaturedEventMetadata, ColorMetadata {
    characters: SimplifiedCharData[];
}

interface SimplifiedCharData {
    name: string;
    id: string;
    rarity: number;
    main: boolean;
    profileUrl: string;
}


import { Nullable } from "@utils/utils";

export interface ItemMaterial {
    itemId: string;
    iconId: string;
    sortId: number;
    name: string;
    description: string;
    rarity: number;
    usage: string;
    overrideBkg: Nullable<string>;
    stackIconId: Nullable<string>;
    obtainApproach: Nullable<string>;
    itemType: ItemType;
    classifyType: ItemClassifyType;
    buildingProductList: BuildProductData[];
    stageDropList: StageDropData[];
}

interface StageDropData {
    stageId: string;
    occPer: 'SOMETIMES' | 'ALMOST' | 'USUAL' | 'OFTEN' | 'ALWAYS';
}

interface BuildProductData {
    roomType: 'WORKSHOP';
    formulaId: number;
}


type ItemClassifyType = 'MATERIAL' | 'NORMAL' | 'NONE' | 'CONSUME';

type ItemType =
    'CARD_EXP'
    | 'MATERIAL'
    | 'GOLD'
    | 'DIAMOND'
    | 'DIAMOND_SHD'
    | 'HGG_SHD'
    | 'LGG_SHD'
    | 'EXP_PLAYER'
    | 'TKT_TRY'
    | 'TKT_RECRUIT'
    | 'TKT_INST_FIN'
    | 'TKT_GACHA'
    | 'TKT_GACHA_10'
    | 'SOCIAL_PT'
    | 'AP_GAMEPLAY'
    | 'AP_BASE'
    | 'TKT_GACHA_PRSV'
    | 'LMTGS_COIN'
    | 'EPGS_COIN'
    | 'REP_COIN'
    | 'CRS_SHOP_COIN'
    | 'RETRO_COIN'
    | 'RENAMING_CARD'
    | 'AP_SUPPLY'
    | 'LIMITED_TKT_GACHA_10'
    | 'LINKAGE_TKT_GACHA_10'
    | 'VOUCHER_PICK'
    | 'VOUCHER_ELITE_II_5'
    | 'VOUCHER_SKIN'
    | 'VOUCHER_CGACHA'
    | 'VOUCHER_MGACHA'
    | 'VOUCHER_FULL_POTENTIAL'
    | 'UNI_COLLECTION'
    | 'AP_ITEM'
    | 'CRS_RUNE_COIN'
    | 'ACTIVITY_COIN'
    | 'ACTIVITY_ITEM'
    | 'ET_STAGE';

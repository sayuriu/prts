import { Nullable } from "@utils/utils";
import { Range } from "../Basic";
import { BlackboardItem } from "./BlackBoardItem";

export interface CharCombatSkill {
    name: string;
    iconId: Nullable<string>;
    hidden: boolean;
    levels: SkillLevelData[];
}

interface SkillLevelData {
    name: string;
    rangeId: string;
    description: string;
    skillType: Range<0, 3>;
    spData: SkillSpData;
    blackboard: BlackboardItem[];
    duration: number;
}

interface SkillSpData {
    spType: Range<0, 3>;
    levelUpCost: Nullable<unknown>;
    maxChargeTime: number;
    spCost: number;
    initSp: number;
    increment: number;
}

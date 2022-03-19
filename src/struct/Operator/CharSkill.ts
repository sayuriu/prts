import { Range } from "../Basic";
import { EvolveItemData } from "./EvolveItem";

export interface CharSkill<L extends Range<1, 4>>
{
	skillId: `skchr_${string}_${L}`;
	//TODO: parser needed for the following fields
	overridePrefabKey: string | null;
	overrideTokenKey: string | null;
    /** For skills level 8 - 10 (Mastery). */
	levelUpCostCond: SkillUpCost[];
}

export interface SkillUpCost
{
	unlockCond: SkillUnlockCond;
    lvlUpTime: number;
	levelUpCost: EvolveItemData[];
    // week ref
    lvlUpCost?: EvolveItemData[];
}

export interface SkillUnlockCond {
    phase: Range.$0_2;
    level: number;
}

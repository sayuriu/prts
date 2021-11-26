import { Range } from "../Basic";
import { EvolveItemData } from "./EvolveItem";

export interface CharSkill<L extends Range<1, 4>>
{
	skillId: `skchr_${string}_${L}`;
	//TODO: parser needed for the following fields
	overridePrefabKey: string | null;
	overrideTokenKey: string | null;
	levelUpCostCond: SkillUpCost;
}

interface SkillUpCost
{
	unlockCond: {
		phase: Range.$0_2;
		level: number;
	}
	levelUpTime: number;
	levelUpCost: EvolveItemData[];
}
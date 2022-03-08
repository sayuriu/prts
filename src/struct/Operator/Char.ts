import { HasCandidate, WithNameAndDesc } from "../Basic";
import { CharBasicInfo } from "./CharBasicInfo";
import { CharPhase } from "./CharPhase";
import { CharPotential } from "./CharPotential";
import {CharSkill, SkillUnlockCond} from "./CharSkill";
import { CharTrait, CharTraitCandidate } from "./CharTrait";
import { CharTrustData } from "./CharTrustData";
import { EvolveItemData } from "@struct/Operator/EvolveItem";

export interface Operator
extends CharBasicInfo
{
	trait: CharTrait;
	phases: [
		CharPhase<0>,
		CharPhase<1>?,
		CharPhase<2>?,
	];
	skills: [
		CharSkill<1>,
		CharSkill<2>?,
		CharSkill<3>?,
	];
	talents: HasCandidate<CharTraitCandidate & WithNameAndDesc>[];
	potentialRanks: CharPotential[];
	favorKeyFrames: CharTrustData[];
    allSkillLvlup: {
        unlockCond: SkillUnlockCond,
        lvlUpCost: EvolveItemData[],
        //! HYPERGRYPH, WHY CAN'T YOU BE CONSISTENT WITH DATA STRUCTURE?
        levelUpCost?: EvolveItemData[]
    }[];
}

export { CHAR_NAME, SUMMON_NAME, TRAP_NAME } from "./CharBasicInfo";

import { HasCandidate, WithNameAndDesc } from "../Basic";
import { CharBasicInfo } from "./CharBasicInfo";
import { CharPhase } from "./CharPhase";
import { CharPotential } from "./CharPotential";
import { CharSkill } from "./CharSkill";
import { CharTrait, CharTraitCandidate } from "./CharTrait";

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
	talents: HasCandidate<CharTraitCandidate & WithNameAndDesc>;
	potentialRank: CharPotential[];
}

export { CHAR_NAME, SUMMON_NAME, TRAP_NAME } from "./CharBasicInfo";
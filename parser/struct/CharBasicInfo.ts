import { Range, WithNameAndDesc } from "./Basic";
type Range0_5 = Range.$0_5;

interface CharBooleanFields
{
	canUseGeneralPotentialItem: boolean;
	isNotObtainable: boolean;
	isSpChar: boolean;
}
interface CharFaction
{
	//TODO: parser needed for the following fields
	nationId: string;
	groupId: string | null;
	teamId: string | null;
}
interface CharPotential
{
	potentialItemId: `p_${CHAR_NAME}`;
	maxPotentialLevel: Range0_5;
}
interface CharAsItem
{
	itemUsage: string;
	itemDesc: string;
	itemObtainApproach: string;
}
interface CharProfession
{
	position: "RANGED" | "MELEE",
	//TODO: parser needed for the following fields
	tagList: string[];
	profession: string;
	subProfessionId: string;
}

export interface CharBasicInfo
extends
	CharBooleanFields,
	CharFaction,
	CharPotential,
	CharAsItem,
	CharProfession,
	WithNameAndDesc
{
	displayNumber: `${string}${number}`;
	tokenKey?: SUMMON_NAME;
	appellation: string;
	rarity: Range0_5;
}

export type CHAR_NAME = `char_${number}_${string}`;
export type SUMMON_NAME = `token_${number}_${string}_${string}`;
export type TRAP_NAME = `trap_${number}_${string}`;
import { List } from './Operator.list'

type OPERATOR_NAME = `char_${number}_${string}`;
type SUMMON_NAME = `token_${number}_${string}_${string}`;
type TRAP_NAME = `trap_${number}_${string}`;

interface CharBooleanFields {
	canUseGeneralPotentialItem: boolean;
	isNotObtainable: boolean;
	isSpChar: boolean;
}
interface CharFaction {
	//TODO: parser needed for the following fields
	nationId: ''
	groupId: string | null;
	teamId: string | null;
}
interface CharPotential {
	potentialItemId: `p_${OPERATOR_NAME}`;
	maxPotentialLevel: 1 | 2 | 3 | 4 | 5;
}
interface CharAsItem {
	itemUsage: string;
	itemDesc: string;
	itemObtainApproach: string;
}
interface CharProfession {
	position: "RANGED" | "MELEE",
	//TODO: parser needed for the following fields
	tagList: string[];
	profession: string;
}
interface Operator
extends
	CharAsItem,
	CharBooleanFields,
	CharFaction,
	CharPotential,
	CharProfession
{
	name: string;
	description: string;
	displayNumber: `${string}${number}`;
	tokenKey?: SUMMON_NAME;
	appellation: string;

	rarity: 0 | 1 | 2 | 3 | 4 | 5;

	trait: CharTrait;
}

interface CharTrait
{

}
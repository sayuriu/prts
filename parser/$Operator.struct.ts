import { List } from './Operator.list'

type CHAR_NAME = `char_${number}_${string}`;
type SUMMON_NAME = `token_${number}_${string}_${string}`;
type TRAP_NAME = `trap_${number}_${string}`;

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

type Range0_6 = Range<0, 6>;
type Range0_2 = Range<0, 3>;
//TODO: parser needed for the following fields
type CharRangeId = string;
//

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
	maxPotentialLevel: Range0_6;
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
}
interface CharTrait
{
	candidates: CharTraitCandidates[];
}

interface BlackboardTable
{
	value: number;
	//TODO: parser needed for the following fields
	key: string;
}

interface CharTraitCandidates
{
	unlockCondition: {
		phase: Range0_2;
		level: number;
	};
	requiredPotentialRank: Range0_6,
	blackboard: BlackboardTable[];
	overrideDescripton: string;
	rangeId: CharRangeId;
	//TODO: parser needed for the following fields
	prefabKey: string;
}

interface CharStatsData
{
	maxHp: number;
	atk: number;
	def: number;
	magicResistance: number;
	cost: number;
	blockCnt: number;
	moveSpeed: number;
	attackSpeed: number;
	baseAttackTime: number;
	respawnTime: number;
	hpRecoveryPerSec: number;
	spRecoveryPerSec: number;
	maxDeployCount: number;
	maxDeckStackCnt: number;

	// TODO: parser needed for the following fields but hmmmm
	tauntLevel: number;
	massLevel: number;
	baseForceLevel: number;

	stunImmune: boolean;
	silenceImmune: boolean;
	sleepImmune: boolean;
}

interface CharStatsLevel<L extends number>
{
	level: L;
	data: CharStatsData;
}

interface ItemData
{
	id: `${number}`;
	count: number;
	type: "MATERIAL";
}

type IntrinsicOpLevel = [
	[30],
	[30],
	[45, 55],
	[45, 60, 70],
	[50, 70, 80],
	[50, 80, 90],
]

interface CharPhases<L extends number>
{
	characterPrefabKey: CHAR_NAME;
	rangeId: CharRangeId;
	maxLevel: IntrinsicOpLevel[number][L];
	attributesKeyFrames: [CharStatsLevel<1>, CharStatsLevel<L>];
	evolveCost: ItemData[] | null;
}

interface SkillUpCost
{
	unlockCond: {
		phase: Range0_2;
		level: number;
	}
	levelUpTime: number;
	levelUpCost: ItemData[];
}
interface CharSkill<L extends number>
{
	skillId: `skchr_${string}_${L}`;
	//TODO: parser needed for the following fields
	overridePrefabKey: string | null;
	overrideTokenKey: string | null;
	levelUpCostCond: SkillUpCost;
}

export interface Operator
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
	rarity: Range0_6;
	trait: CharTrait;
	phases: [
		CharPhases<0>,
		CharPhases<1>?,
		CharPhases<2>?,
	];
	skills: [
		CharSkill<1>,
		CharSkill<2>?,
		CharSkill<3>?,
	];
	talents: CharTrait & { name: string, description: string };
}
import { List } from './Operator.list'
import { AttackRange } from './struct/Operator/AttackRange';
import { Range } from './struct/Basic'

type Range0_2 = Range.$0_2;
type Range0_5 = Range.$0_5;

type CHAR_NAME = `char_${number}_${string}`;
type SUMMON_NAME = `token_${number}_${string}_${string}`;
type TRAP_NAME = `trap_${number}_${string}`;

//TODO: parser needed for the following fields

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
interface CharTrait
{
	candidates: CharTraitCandidate[];
}

interface BlackboardItem
{
	value: number;
	//TODO: parser needed for the following fields
	key: string;
}

interface CharTraitCandidate
{
	unlockCondition: {
		phase: Range0_2;
		level: number;
	};
	requiredPotentialRank: Range0_5,
	blackboard: BlackboardItem[];
	overrideDescripton: string;
	rangeId: AttackRange['id'];
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
	rangeId: AttackRange['id'];
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

interface WithNameAndDesc
{
	name: string;
	description: string;
}
interface CharPotentialData
{
	//TODO: parser needed for the following fields
	type: number
	equivalentCost: number | null;
	//
	description: string;
	buff: CharPotentialBuffData;
}

interface CharPotentialBuffData
{
	//TODO: parser needed for the following fields
	abnormalFlags: null;
	abnormalImmunes: null;
	abnormalAntis: null;
	abnormalCombos: null;
	abnormalComboImmunes: null;
	//
	attributeModifiers: AttributeModifierData[];
}

interface AttributeModifierData
{
	//TODO: parser needed for the following fields
	attributeType: number,
	formulaItem: number,
	//
	value: number,
	loadFromBlackboard: boolean,
	fetchBaseValueFromSourceEntity: boolean,
}

export default interface Operator
extends
	CharAsItem,
	CharBooleanFields,
	CharFaction,
	CharPotential,
	CharProfession,
	WithNameAndDesc
{
	displayNumber: `${string}${number}`;
	tokenKey?: SUMMON_NAME;
	appellation: string;
	rarity: Range0_5;

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
	talents: {
		candidates: (CharTraitCandidate & WithNameAndDesc)[],
	};
	potentialRank: CharPotentialData[];
}
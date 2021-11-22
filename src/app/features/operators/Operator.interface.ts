const materials = [];

type ObjectHasProps<T extends string> = {
	[Pr in T]?: string;
};

type ArrayElement<A extends readonly unknown[]> =
  A extends readonly (infer E)[] ? E : never;

type Optional<T> = {
	[P in keyof T]?: T[P];
}


type GameLocales = 'jp' | 'en' | 'cn' | 'kr';
type Game_HasLocaleString = ObjectHasProps<GameLocales>

type OpFactionCodes = {
	'Victoria': 'vc',
	'Rhodes Island': 'ri',
}

type OpRoles = {
	'DP_RECOVERY': 'Recovers Deployment Points by using skills.',
	'SUPPORT': 'Provides utilities and assistance for other Operators.'
}

type OpTraits = {
	'skill_no_block': 'Can\'t block hostiles while skill is active',
}

type OpRange = {
	'melee': 'Hits things nearby.',
	'ranged': 'Hits things from a distance.'
}

type OpGender = {
	'm': 'Male. Maybe your husbando.',
	'f': 'Female. Maybe your waifu.'
}

type OpFaction = {
	[P in keyof OpFactionCodes]: {
		faction: P;
		id: {
			faction: `${OpFactionCodes[P]}${number}`;
		}
	}
}[keyof OpFactionCodes]

interface OpOverview {
	names: Game_HasLocaleString;
	id: {
		num: number | `${number}`;
		name: string;
	}

	rarity: 1 | 2 | 3 | 4 | 5 | 6;
	position: keyof OpRange;
	sex: keyof OpGender;

	roles: (keyof OpRoles)[];
	trait: keyof OpTraits;
}

// ****************************************************************
const OpClasses = {
	'vanguard': {
		description: 'One among the first units to be deployed. Suitable for handling initial waves of hostiles and provide DP for further deployments.',
		subclasses: {
			'flag': 'Generates the most DP through skills, but is unable to block hostiles while skill is active.',
			'pioneer': 'Standard vanguard with 2 blocks.',
			'assault': 'Deals high single-strike damage, and gains DP on kill.',
			'tactican': 'Can summon additional units within self\'s attack range to assist in battle.'
		}
	},
	'guard': {
		description: 'Deals damage with melee attacks, with a few exceptions.',
		subclasses: {
			'lord': 'Has longer attack range and is capable of attacking airborne units.',
			'centurion': 'Chainsaws multiple enemies equal to block count.'
		}
	}
}

type Classes = typeof OpClasses;
type OpClass = {
	[P in keyof Classes]: {
		main: P;
		sub: keyof Classes[P]['subclasses'];
	}
}[keyof Classes]

type potential_bonuses = {
	deploy: 'Deploy Cost -1',
	redeploy: 'Redeployment Time -4s',
	first_talent: 'First Talent UP!',
	second_talent: 'Second Talent UP!',
	atk: 'ATK +25',
}
type potentialnum = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

type OpPotentials = {
	[P in keyof potentialnum]: keyof potential_bonuses;
}

type trust_bonuses = {
	atk: 'ATK +40',
	def: 'DEF +40',
}

interface ClassProfession {
	class: OpClass;
	potentials: OpPotentials;
	trust_extra: (keyof trust_bonuses)[];
}

//*****************************************************************
type OpTalentParam = {
	[attribute: string]: `${number}`;
}

interface OpTalent {
	name: string;
	description: string[];
	params?: {
		elites: {
			1: OpTalentParam;
			2: OpTalentParam;
		}
		potentials: {
			[P in keyof potentialnum]?: OpTalentParam;
		}
	}
}
//*****************************************************************
type MatrixStats<T> = T extends null ? { noStat: true } : [T, T, T, T, T, T, T, T, T, T] | { isConstant: true, value: T } | { linkValuesTo: keyof CombatSkillAffectParams };

interface CombatSkillAffectParams {
	'atk_to_hp_recovery_ratio': MatrixStats<number>;
	'dp_gain': MatrixStats<number>;
	'def_percentage': MatrixStats<number>;
	'atk_scale': MatrixStats<number>;
	'stun_duration': MatrixStats<number>;
	'effect_weaken': MatrixStats<number>;
	'effect_slow': MatrixStats<null>;
}
interface CombatSkillCoreAttr {
	'sp_init': MatrixStats<number>;
	'sp_cost': MatrixStats<number>;
	'skill_duration'?: MatrixStats<number>;
}

interface CombatSkillTrait {
	sp_charge: 'per_second' | 'on_attack' | 'on_damage';
	trigger: 'manual' | 'auto';
}

type CombatSkillRangeMatrixRow = (null | 0 | 1)[];

interface CombatSkillRange {
	isConstant: boolean;
	matrix:
	{
		onLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
		matrix: CombatSkillRangeMatrixRow[];
	}[]
	| CombatSkillRangeMatrixRow[];
}

interface CombatSkillRequirementElite<T extends 1 | 2> {
	requirements: {
		rank: {
			elite: T;
			level: 1;
		}
	}
}

type CombatSkillRequirementAvailableMaterials = ''
interface CombatSkillRequirementMaterials {
	[k: string]: number;
}

interface CombatSkillRequirement {
	matrix: CombatSkillRequirementMaterials[]
}

interface CombatSkill {
	name: string;
	trait: CombatSkillTrait;
	description: string[];
	level_matrix: Optional<CombatSkillAffectParams> & CombatSkillCoreAttr;
	range?: CombatSkillRange;
	requirements: CombatSkillRequirement;
}

interface CombatSkills {
	1: CombatSkill;
	2: CombatSkill & CombatSkillRequirementElite<1>;
	3?: CombatSkill & CombatSkillRequirementElite<2>;
}

type InfrastructureSkillTraits = 'UNIQUE';

interface InfrastructureSkill {
	name: string;
	traits?: InfrastructureSkillTraits;
	description: string;
	elite_matrix?:
	{
		[value: string]: [number, number]
	}
}

interface InfrastructureSkills {
	1: InfrastructureSkill;
	2?: InfrastructureSkill;
}

interface OpSkills {
	combat: CombatSkills;
	infrastructure: InfrastructureSkills;
}

// ****************************************************************
export interface Operator {
	overview: OpOverview & OpFaction;
	profession: ClassProfession;
	talents: {
		1: OpTalent;
		2?: OpTalent;
	}
	skills: OpSkills;
}

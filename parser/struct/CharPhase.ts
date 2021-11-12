import { CharRangeId } from "./Basic";
import { CHAR_NAME } from "./CharBasicInfo";
import { EvolveItemData } from "./EvolveItem";

type IntrinsicOpLevel = [
	[30],
	[30],
	[45, 55],
	[45, 60, 70],
	[50, 70, 80],
	[50, 80, 90],
]

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

export interface CharPhase<L extends number>
{
	characterPrefabKey: CHAR_NAME;
	rangeId: CharRangeId;
	maxLevel: IntrinsicOpLevel[number][L];
	attributesKeyFrames: [CharStatsLevel<1>, CharStatsLevel<IntrinsicOpLevel[number][L]>];
	evolveCost: EvolveItemData[] | null;
}
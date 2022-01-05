export interface CharTrustData {
	level: number;
	data: CharTrustAttributes;
}

interface CharTrustAttributes {
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
	tauntLevel: number;
	massLevel: number;
	baseForceLevel: number;
	stunImmune: boolean;
	silenceImmune: boolean;
	sleepImmune: boolean;
}
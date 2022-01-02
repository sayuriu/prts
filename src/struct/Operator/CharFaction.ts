export interface CharFaction {
	powerId: string;
	orderNum: number;
	powerLevel: number;
	powerName: string;
	powerCode: string;
	color: string;
	isLimited: boolean;
	isRaw: boolean;
}

export const defaultCharFaction: CharFaction = {
	powerId: 'unknown',
	orderNum: -1,
	powerLevel: -1,
	powerName: 'Unknown',
	powerCode: 'Unknown',
	color: '000000',
	isLimited: false,
	isRaw: false,
};
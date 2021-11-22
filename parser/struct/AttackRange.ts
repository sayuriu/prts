import { Range } from "./Basic";

export interface AttackRange
{
	id: `${'x'|'y'|'b'|Range<0, 6>}-${Range<1, 17>}`;
	direction: 1;
	grids: TileData[];
}

interface TileData
{
	row: number;
	col: number;
}
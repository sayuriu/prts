import { Range } from "../Basic";

export interface AttackRange
{
	_referId?: `${'x'|'y'|'b'|Range<0, 6>}-${Range<1, 17>}`;
	id: string;
	direction: number;
	grids: TileData[];
}

interface TileData
{
	row: number;
	col: number;
}

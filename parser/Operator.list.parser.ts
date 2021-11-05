import { Destination } from './AceshipJSONParser';
import { readdirSync, writeFileSync } from 'fs';
import { inspect } from 'util';
import { join } from 'path';
import beautify from 'beautify';

const latestCharDataPath = join(Destination.BASE_JSON_LOCALE_PATH.replace('{locale}', 'zh_CN'), 'characters');
const latestCharData = readdirSync(latestCharDataPath);

interface Summon {
	id: string;
	unit: string;
}
interface Data {
	char: Record<string, string>;
	trap: Record<string, string>;
	token: Record<string, Summon>;
}
const data: Data = {
	char: {},
	trap: {},
	token: {},
};

for (const name of latestCharData)
{
	const [sType, sID, sName, sToken] = name.replace('.json', '').split('_');
	if (sToken)
	{
		data.token[sToken] = {
			id: sID,
			unit: sName,
		}
		continue;
	}
	(data[sType as keyof Data] as Record<string, string>)[sName] = sID;
}

writeFileSync(
	'./Operator.list.ts',
	'export const List = '
	+ beautify(inspect(data, false, null, false), { format: 'js'})
	+ ';'
);
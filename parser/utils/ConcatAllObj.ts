import { writeFileSync } from "fs";
import { inspect } from "util";
import beautifier from 'beautify';

type UnknownObj = Record<string | number | symbol, any>
// Concat all properties of 2 objects.
export function concatObjects(obj1: UnknownObj, obj2: UnknownObj)
{
	for (const key in obj2)
	{
		if (Object.keys(obj1[key] || {}) < Object.keys(obj2[key] || {}))
			obj1[key] = obj2[key];
		// If the object is nested, concat it.
		if (obj2[key] && typeof obj2[key] === 'object')
			concatObjects(obj1[key], obj2[key]);
	}
	return obj1;
}

export function writeData(fileName: string, data: UnknownObj, comments: string[] = [])
{
	writeFileSync(
		fileName + '.ts',
		comments.map((_: Object) => `//${_.toString()}`).join('\n') + '\n' +
		'exports = ' +
		beautifier(inspect(data, false, null, false), { format: 'js' }),
	);
}
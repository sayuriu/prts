import { readdirSync, writeFileSync } from 'fs';
import { inspect } from 'util';
import beautifier from 'beautify'
const path = '..\\src\\assets\\gamedata\\json\\locales\\zh_CN\\characters'

let value = {};
readdirSync(path).forEach(file => {
	const data = require(path + '\\' + file);
	value = concatObjects(value, data);
});
writeFileSync(
	'./full_concat_obj.js',
	'// This data is meant for contructing data structures.\n' +
	'module.exports = ' +
	beautifier(inspect(value, false, null, false), { format: 'js' }),
);

type UnknownObj = Record<string | number | symbol, any>
// Concat all properties of 2 objects.
function concatObjects(obj1: UnknownObj, obj2: UnknownObj) {
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
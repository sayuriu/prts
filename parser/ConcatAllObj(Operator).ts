import { readdirSync } from 'fs';
import { concatObjects, writeData } from './utils/ConcatAllObj';
const path = '../src/assets/gamedata/json/locales/zh_CN/characters';

let value = {};
readdirSync(path).forEach(file => {
	const data = require(path + '/' + file);
	value = concatObjects(value, data);
});
writeData('./OPERATOR_ALL.data', value, ['This data is meant for constructing data structures.'])

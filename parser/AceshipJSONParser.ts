// $ tsc AceshipJSONParser.ts --target es2020 --moduleResolution node --module commonjs
import { writeFile } from 'fs';
import { resolve } from 'path';
import Operator  from './Operator.struct';
import { ACESHIP_DIR_ROOT, DESTINATION_ROOT } from './AceshipEnv';
import { concatObjects, writeData } from './utils/ConcatAllObj';
import Logger from './Logger';
import { createIfNotExist, joinPaths } from './utils/PathUtils';

export const AvailableLocales = {
	'en_US': true,
	'ja_JP': true,
	'ko_KR': true,
	'zh_CN': true,
	'zh_TW': true,
};

type Locales = keyof typeof AvailableLocales;

export namespace Aceship {
	// -> root/ref/AN-EN-Tags
	export const BASE_PATH = "{ACESHIP_DIR_ENV}\\json\\gamedata\\{locale}\\gamedata\\excel".replace('{ACESHIP_DIR_ENV}', ACESHIP_DIR_ROOT);
	export namespace DATA {
		export const items = 'item_table.json';
		export const characters = 'character_table.json';
		export const medals = 'medal_table.json';
		export const teams = 'handbook_team_table.json';
		export const ranges = 'range_table.json';
	}
}

export namespace Destination {
	export const BASE_JSON_LOCALE_PATH = '{DEST_ROOT}\\json\\locales\\{locale}'.replace('{DEST_ROOT}', DESTINATION_ROOT);
	export namespace DATA {
		export const teams = 'teams';
		export const medals = {
			_base: 'medals',
			medalsToType_JSON: 'medalToType.json',
			typeToMedals_JSON: 'typeToMedals.json',
			list: 'list/{type}/{name}',
			types: 'types/{name}'
		};
		export const items = {
			_base: 'items',
			types: 'types',
			materials: 'materials/{type}',
			itemToType_JSON: 'itemToType.json',
			typeToItems_JSON: 'typeToItems.json',
		};
		export const characters = {
			_base: 'characters',
			_link_JSON: '../charnameLinkID.json',
		};
		export const ranges = {
			_base: 'ranges',
		};
	}
}


function writeJSON(path: string, data: any) {
	writeFile(path, JSON.stringify(data, null, '\t'), (err) => {
		if (err) throw err;
	});
}

// en_US, lang_COUNTRY
function getLocale(input: string) {
	const match =input.match(/[a-z]{2}_[A-Z]{2}/);
	if (match) return match[0];
	return null;
}

function isCN(locale: string | null) {
	if (!locale) return false;
	return locale.indexOf('zh_CN') > -1;
}

function parseChar(src: string, dest: string)
{
	const { _base, _link_JSON } = Destination.DATA.characters;
	const header = 'Characters-' + getLocale(src);
	createIfNotExist(joinPaths(dest, _base), header);
	const chars = require(src) as Record<string, Operator>;
	const charnameLinkID: Record<string, string> = {};
	const tracker = new CountTracker();
	for (const char in chars)
	{
		writeJSON(joinPaths(dest, _base ,`${char}.json`), chars[char]);
		charnameLinkID[chars[char].name] = char;
		tracker.increment();
	}
	Logger.info(header, `${Logger.green(tracker.count)} entries parsed.`);
	Logger.info(header, `Writing ${Logger.yellow(_link_JSON.replace('../', ''))}...`, false);
	writeJSON(joinPaths(dest, _base, _link_JSON), charnameLinkID);
	if (isCN(getLocale(src))) writeJSON(joinPaths('.', 'json', 'char_list.json'), Object.keys(chars));
	Logger.log(null, Logger.green('done'));
	Logger.info(header, Logger.green('Write complete!'));
}

function parseItem(src: string, dest: string)
{
	const header = 'Items-' + getLocale(src);
	const { _base, types, materials, itemToType_JSON, typeToItems_JSON } = Destination.DATA.items;
	const items = require(src);
	createIfNotExist(joinPaths(dest, _base), header);
	createIfNotExist(joinPaths(dest, _base, types), header);
	for (const name in items)
	{
		if (name === 'items') continue;
		Logger.info(header, `Writing ${Logger.yellow(`${name}.json...`)}`, false);
		writeJSON(
			joinPaths(dest, _base, types, `${name}.json`),
			items[name]
		);
		Logger.log(null, Logger.green('done'));
	}
	createIfNotExist(joinPaths(dest, _base, 'materials'), header);
	Logger.info(header, 'Parsing materials...');
	const matData: Record<string, any> = {};
	const matTypes: Record<string, string[]> = {};
	let FullConcatObj: Record<string, any> = {};
	const tracker = new CountTracker();
	for (const item in items.items)
	{
		const actualItem = items.items[item];
		FullConcatObj = concatObjects(FullConcatObj, actualItem);
		const itemType = actualItem.itemType;
		matData[item] = itemType;
		if (!matTypes[itemType]) matTypes[itemType] = [];
		matTypes[itemType].push(item);
		createIfNotExist(joinPaths(dest, _base, materials.replace('{type}', itemType)), header, true);
		writeJSON(
			joinPaths(dest, _base, materials.replace('{type}', itemType), `${item}.json`),
			actualItem,
		)
		tracker.increment();
	}
	writeData('./ITEM_ALL.data', FullConcatObj, ['materials']);
	Logger.info(header, `${Logger.green(tracker.count)} entries parsed.`);
	Logger.info(header, `Writing ${Logger.yellow(itemToType_JSON.replace('../', ''))}...`, false);
	writeJSON(joinPaths(dest, _base, itemToType_JSON), matData);
	Logger.log(null, Logger.green('done'));
	Logger.info(header, `Writing ${Logger.yellow(typeToItems_JSON.replace('../', ''))}...`, false);
	if (isCN(getLocale(src))) writeJSON(joinPaths('.', 'json', typeToItems_JSON), matTypes);
	writeJSON(joinPaths(dest, _base, typeToItems_JSON), matTypes);
	Logger.log(null, Logger.green('done'));
	Logger.info(header, Logger.green('Write complete!'));
}

function parseRangeData(src: string, dest: string)
{
	const header = 'Ranges-' + getLocale(src);
	// if (getLocale(src) === 'zh_CN')
	const { _base } = Destination.DATA.ranges;
	const ranges = require(src);
	createIfNotExist(joinPaths(dest, _base), header);
	const tracker = new CountTracker();
	for (const name in ranges)
	{
		writeJSON(
			joinPaths(dest, _base, `${name}.json`),
			ranges[name]
		);
		tracker.increment();
	}
	Logger.info(header, `${Logger.green(tracker.count)} entries parsed.`);
}

export function AceshipJSONParser(locale: Locales) {
	if (!AvailableLocales[locale])
		throw new Error(`${locale} is not available.`);

	Logger.info(locale, Logger.purple('Init'));
	const localePath = joinPaths(Aceship.BASE_PATH.replace('{locale}', locale));
	Logger.info(locale, `${Logger.yellow('Source')}: ${resolve(localePath)}`);
	const destinationPath = joinPaths(Destination.BASE_JSON_LOCALE_PATH.replace('{locale}', locale));
	Logger.info(locale, `${Logger.green('Target')}: ${resolve(destinationPath)}`);
	createIfNotExist(destinationPath, `Locale-${locale}`);
	parseChar(joinPaths(localePath, Aceship.DATA.characters), destinationPath);
	parseItem(joinPaths(localePath, Aceship.DATA.items), destinationPath);
	parseRangeData(joinPaths(localePath, Aceship.DATA.ranges), destinationPath);
	Logger.cout('\n');
}

export function parseAll()
{
	for (const locale in AvailableLocales)
		AceshipJSONParser(locale as Locales);
	Logger.success('Parser', 'Parsing complete!');
}

export class CountTracker {
	private _count: number = 0;
	public get count(): number { return this._count; }
	public add(count: number) { this._count += count; }
	public increment() { this._count++; }
	constructor(startCount = 0) { this._count = startCount; }
}
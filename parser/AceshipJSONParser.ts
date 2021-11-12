// $ tsc AceshipJSONParser.ts --target es2020 --moduleResolution node --module commonjs
import { writeFile, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';
import Operator  from './Operator.struct';
import chalk from 'chalk';
import Logger from './Logger';

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
	export const BASE_PATH = "..\\aceship\\AN-EN-Tags\\json\\gamedata\\{locale}\\gamedata\\excel";
	export namespace DATA {
		export const items = 'item_table.json';
		export const characters = 'character_table.json';
		export const medals = 'medal_table.json';
		export const teams = 'handbook_team_table.json';
		export const ranges = 'range_table.json';
	}
}

export namespace Destination {
	export const BASE_JSON_LOCALE_PATH = '..\\src\\assets\\gamedata\\json\\locales\\{locale}';
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

function createIfNotExist(path: string, header: string | null = null, silent: boolean = false) {
	if (!existsSync(path))
	{
		Logger.info(header, `Attempting to create ${chalk.underline(path)}...`, false);
		mkdirSync(path);
		Logger.log(null, Logger.green('done'))
		return;
	}
	if (!silent) Logger.info(header, `${Logger.green('Found')} ${chalk.underline(path)}`);
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
	createIfNotExist(join(dest, _base), header);
	const chars = require(src) as Record<string, Operator>;
	const charnameLinkID: Record<string, string> = {};
	const tracker = new CountTracker();
	for (const char in chars)
	{
		writeJSON(join(dest, _base ,`${char}.json`), chars[char]);
		charnameLinkID[chars[char].name] = char;
		tracker.increment();
	}
	Logger.info(header, `${Logger.green(tracker.count)} entries parsed.`);
	Logger.info(header, `Writing ${Logger.yellow(_link_JSON.replace('../', ''))}...`, false);
	writeJSON(join(dest, _base, _link_JSON), charnameLinkID);
	if (isCN(getLocale(src))) writeJSON(join('.', 'json', 'char_list.json'), Object.keys(chars));
	Logger.log(null, Logger.green('done'));
	Logger.info(header, Logger.green('Write complete!'));
}

function parseItem(src: string, dest: string)
{
	const header = 'Items-' + getLocale(src);
	const { _base, types, materials, itemToType_JSON, typeToItems_JSON } = Destination.DATA.items;
	const items = require(src);
	createIfNotExist(join(dest, _base), header);
	createIfNotExist(join(dest, _base, types), header);
	for (const name in items)
	{
		if (name === 'items') continue;
		Logger.info(header, `Writing ${Logger.yellow(`${name}.json...`)}`, false);
		writeJSON(
			join(dest, _base, types, `${name}.json`),
			items[name]
		);
		Logger.log(null, Logger.green('done'));
	}
	createIfNotExist(join(dest, _base, 'materials'), header);
	Logger.info(header, 'Parsing materials...');
	const matData: Record<string, any> = {};
	const matTypes: Record<string, string[]> = {};
	const tracker = new CountTracker();
	for (const item in items.items)
	{
		const actualItem = items.items[item];
		const itemType = actualItem.itemType;
		matData[item] = itemType;
		if (!matTypes[itemType]) matTypes[itemType] = [];
		matTypes[itemType].push(item);
		createIfNotExist(join(dest, _base, materials.replace('{type}', itemType)), header, true);
		writeJSON(
			join(dest, _base, materials.replace('{type}', itemType), `${item}.json`),
			actualItem,
		)
		tracker.increment();
	}
	Logger.info(header, `${Logger.green(tracker.count)} entries parsed.`);
	Logger.info(header, `Writing ${Logger.yellow(itemToType_JSON.replace('../', ''))}...`, false);
	writeJSON(join(dest, _base, itemToType_JSON), matData);
	Logger.log(null, Logger.green('done'));
	Logger.info(header, `Writing ${Logger.yellow(typeToItems_JSON.replace('../', ''))}...`, false);
	if (isCN(getLocale(src))) writeJSON(join('.', 'json', typeToItems_JSON), matTypes);
	writeJSON(join(dest, _base, typeToItems_JSON), matTypes);
	Logger.log(null, Logger.green('done'));
	Logger.info(header, Logger.green('Write complete!'));
}

function parseRangeData(src: string, dest: string)
{
	const header = 'Ranges-' + getLocale(src);
	// if (getLocale(src) === 'zh_CN')
	const { _base } = Destination.DATA.ranges;
	const ranges = require(src);
	createIfNotExist(join(dest, _base), header);
	const tracker = new CountTracker();
	for (const name in ranges)
	{
		writeJSON(
			join(dest, _base, `${name}.json`),
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
	const localePath = join(Aceship.BASE_PATH.replace('{locale}', locale));
	Logger.info(locale, `${Logger.yellow('Source')}: ${resolve(localePath)}`);
	const destinationPath = join(Destination.BASE_JSON_LOCALE_PATH.replace('{locale}', locale));
	Logger.info(locale, `${Logger.green('Target')}: ${resolve(destinationPath)}`);
	createIfNotExist(destinationPath, `Locale-${locale}`);
	parseChar(join(localePath, Aceship.DATA.characters), destinationPath);
	parseItem(join(localePath, Aceship.DATA.items), destinationPath);
	parseRangeData(join(localePath, Aceship.DATA.ranges), destinationPath);
	Logger.cout('\n');
}

export function parseAll()
{
	for (const locale in AvailableLocales)
		AceshipJSONParser(locale as Locales);
	Logger.success('Parser', 'Parsing complete!');
}

class CountTracker {
	private _count: number = 0;
	public get count(): number { return this._count; }
	public add(count: number) { this._count += count; }
	public increment() { this._count++; }
	constructor(startCount = 0) { this._count = startCount; }
}

parseAll();
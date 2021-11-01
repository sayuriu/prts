const fs_p = require('fs/promises');
const fs_std = require('fs');
const path = require('path');

const locales = ['en_US', 'ja_JP', 'ko_KR', 'zh_CN', 'zh_TW'];
// prts/ref ->
const Aceship_PATH = "..\\..\\..\\..\\..\\ref\\AN-EN-Tags\\json\\gamedata\\{locale}\\gamedata\\excel";

const Lookfor = {
	items: 'item_table.json',
	characters: 'character_table.json',
	medals: 'medal_table.json',
	teams: 'handbook_team_table.json',
}

const Destination_PATH = '.\\{locale}'

async function main(locale)
{
	const gamedata_PATH = Aceship_PATH.replace('{locale}', locale);
	const destination_PATH= Destination_PATH.replace('{locale}', locale);
	createIfNotExist(path.join(destination_PATH, ''));
	CharParser(path.join(gamedata_PATH, Lookfor.characters), destination_PATH, '');
	ItemParser(path.join(gamedata_PATH, Lookfor.items), destination_PATH);
	MedalParser(path.join(gamedata_PATH, Lookfor.medals), destination_PATH);
	TeamParser(path.join(gamedata_PATH, Lookfor.teams), destination_PATH);
}

async function CharParser(src, dest)
{
	const chars = require(src);
	const charnameLinkID = {};
	createIfNotExist(path.join(dest, 'chars'));
	for (const char in chars)
	{
		fs_p.writeFile(path.join(dest, 'chars', `${char}.json`), JSON.stringify(chars[char], null, '\t'));
		charnameLinkID[chars[char].name] = char;
	}
	fs_p.writeFile(path.join(dest, `charnameLinkID.json`), JSON.stringify(charnameLinkID, null, '\t'));
}

async function ItemParser(src, dest)
{
	createIfNotExist(path.join(dest, 'items'));
	createIfNotExist(path.join(dest, 'items/types'));
	createIfNotExist(path.join(dest, 'items/materials'));
	const items = require(src);
	for (const name in items)
	{
		if (name === 'items') continue;
		fs_p.writeFile(path.join(dest, 'items/types', `${name}.json`), JSON.stringify(items[name], null, '\t'));
	}
	const data = {};
	const types = {};
	for (const item in items.items)
	{
		const actualItem = items.items[item];
		const itemType = actualItem.itemType;
		data[item] = itemType;
		if (!types[itemType]) types[itemType] = [];
		types[itemType].push(item);
		createIfNotExist(path.join(dest, 'items/materials', itemType));
		fs_std.writeFileSync(path.join(dest, 'items/materials', itemType, `${item}.json`), JSON.stringify(actualItem, null, '\t'));
	}
	fs_p.writeFile(path.join(dest, 'items/itemToType.json'), JSON.stringify(data, null, '\t'));
	fs_p.writeFile(path.join(dest, 'items/typeToItem.json'), JSON.stringify(types, null, '\t'));
}

async function MedalParser(src, dest)
{
	createIfNotExist(path.join(dest, 'medals'));
	createIfNotExist(path.join(dest, 'medals/list'));
	createIfNotExist(path.join(dest, 'medals/types'));
	const medals = require(src);
	const data = {};
	const types = {};
	for (const medal of medals.medalList)
	{
		createIfNotExist(path.join(dest, 'medals/list', medal.medalType));
		data[medal.medalId] = medal.medalType;
		if (!types[medal.medalType]) types[medal.medalType] = [];
		types[medal.medalType].push(medal.medalId);
		fs_p.writeFile(path.join(dest, 'medals/list', medal.medalType, `${medal.medalId}.json`), JSON.stringify(medal, null, '\t'));
	}
	for (const type in medals.medalTypeData)
	{
		fs_p.writeFile(path.join(dest, 'medals/types', `${type}.json`), JSON.stringify(medals.medalTypeData[type], null, '\t'));
	}
	fs_p.writeFile(path.join(dest, 'medals/medalToType.json'), JSON.stringify(data, null, '\t'));
	fs_p.writeFile(path.join(dest, 'medals/typeToMedal.json'), JSON.stringify(types, null, '\t'));
}

async function TeamParser(src, dest)
{
	createIfNotExist(path.join(dest, 'teams'));
	const teams = require(src);
	for (const team in teams)
		fs_p.writeFile(path.join(dest, 'teams', `${team}.json`), JSON.stringify(teams[team], null, '\t'));
}

function createIfNotExist(path)
{
	if (!fs_std.existsSync(path))
		fs_std.mkdirSync(path);
}

for (const locale of locales)
{
	main(locale);
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAll = exports.AceshipJSONParser = void 0;
// $ tsc AceshipJSONParser.ts --target es2020 --moduleResolution node --module commonjs
const fs_1 = require("fs");
const path_1 = require("path");
const chalk_1 = require("chalk");
const Logger_1 = require("./Logger");
const AvailableLocales = {
    'en_US': true,
    'ja_JP': true,
    'ko_KR': true,
    'zh_CN': true,
    'zh_TW': true
};
var Aceship;
(function (Aceship) {
    // -> root/ref/AN-EN-Tags
    Aceship.BASE_PATH = "..\\aceship\\AN-EN-Tags\\json\\gamedata\\{locale}\\gamedata\\excel";
    let DATA;
    (function (DATA) {
        DATA.items = 'item_table.json';
        DATA.characters = 'character_table.json';
        DATA.medals = 'medal_table.json';
        DATA.teams = 'handbook_team_table.json';
    })(DATA = Aceship.DATA || (Aceship.DATA = {}));
})(Aceship || (Aceship = {}));
var Destination;
(function (Destination) {
    Destination.BASE_JSON_LOCALE_PATH = '..\\src\\assets\\gamedata\\json\\locales\\{locale}';
    let DATA;
    (function (DATA) {
        DATA.teams = 'teams';
        DATA.medals = {
            _base: 'medals',
            medalsToType_JSON: 'medalToType.json',
            typeToMedals_JSON: 'typeToMedals.json',
            list: 'list/{type}/{name}',
            types: 'types/{name}'
        };
        DATA.items = {
            _base: 'items',
            types: 'types',
            materials: 'materials/{type}',
            itemToType_JSON: 'itemToType.json',
            typeToItems_JSON: 'typeToItems.json',
        };
        DATA.characters = {
            _base: 'characters',
            _link_JSON: '../charnameLinkID.json',
        };
    })(DATA = Destination.DATA || (Destination.DATA = {}));
})(Destination || (Destination = {}));
function writeJSON(path, data) {
    fs_1.writeFile(path, JSON.stringify(data, null, '\t'), (err) => {
        if (err)
            throw err;
    });
}
function createIfNotExist(path, header = null, silent = false) {
    if (!fs_1.existsSync(path)) {
        Logger_1.default.info(header, `Attempting to create ${chalk_1.default.underline(path)}...`, false);
        fs_1.mkdirSync(path);
        Logger_1.default.log(null, Logger_1.default.green('done'));
        return;
    }
    if (!silent)
        Logger_1.default.info(header, `${Logger_1.default.green('Found')} ${chalk_1.default.underline(path)}`);
}
// en_US, lang_COUNTRY
function getLocale(input) {
    const match = input.match(/[a-z]{2}_[A-Z]{2}/);
    if (match)
        return match[0];
    return null;
}
function parseChar(src, dest) {
    const { _base, _link_JSON } = Destination.DATA.characters;
    const header = 'Characters-' + getLocale(src);
    createIfNotExist(path_1.join(dest, _base), header);
    const chars = require(src);
    const charnameLinkID = {};
    const tracker = new CountTracker();
    for (const char in chars) {
        writeJSON(path_1.join(dest, _base, `${char}.json`), chars[char]);
        charnameLinkID[chars[char].name] = char;
        tracker.increment();
    }
    Logger_1.default.info(header, `${Logger_1.default.green(tracker.count)} entries parsed.`);
    Logger_1.default.info(header, `Writing ${Logger_1.default.yellow(_link_JSON.replace('../', ''))}...`, false);
    writeJSON(path_1.join(dest, _base, _link_JSON), charnameLinkID);
    Logger_1.default.log(null, Logger_1.default.green('done'));
    Logger_1.default.info(header, Logger_1.default.green('Write complete!'));
}
function parseItem(src, dest) {
    const header = 'Items-' + getLocale(src);
    const { _base, types, materials, itemToType_JSON, typeToItems_JSON } = Destination.DATA.items;
    const items = require(src);
    createIfNotExist(path_1.join(dest, _base), header);
    createIfNotExist(path_1.join(dest, _base, types), header);
    for (const name in items) {
        if (name === 'items')
            continue;
        Logger_1.default.info(header, `Writing ${chalk_1.default.underline(name)}.json...`, false);
        writeJSON(path_1.join(dest, _base, types, `${name}.json`), items[name]);
        Logger_1.default.log(null, Logger_1.default.green('done'));
    }
    createIfNotExist(path_1.join(dest, _base, 'materials'), header);
    Logger_1.default.info(header, 'Parsing materials...');
    const matData = {};
    const matTypes = {};
    const tracker = new CountTracker();
    for (const item in items.items) {
        const actualItem = items.items[item];
        const itemType = actualItem.itemType;
        matData[item] = itemType;
        if (!matTypes[itemType])
            matTypes[itemType] = [];
        matTypes[itemType].push(item);
        createIfNotExist(path_1.join(dest, _base, materials.replace('{type}', itemType)), header, true);
        writeJSON(path_1.join(dest, _base, materials.replace('{type}', itemType), `${item}.json`), actualItem);
        tracker.increment();
    }
    Logger_1.default.info(header, `${Logger_1.default.green(tracker.count)} entries parsed.`);
    Logger_1.default.info(header, `Writing ${Logger_1.default.yellow(itemToType_JSON.replace('../', ''))}...`, false);
    writeJSON(path_1.join(dest, _base, itemToType_JSON), matData);
    Logger_1.default.log(null, Logger_1.default.green('done'));
    Logger_1.default.info(header, `Writing ${Logger_1.default.yellow(typeToItems_JSON.replace('../', ''))}...`, false);
    writeJSON(path_1.join(dest, _base, typeToItems_JSON), matTypes);
    Logger_1.default.log(null, Logger_1.default.green('done'));
    Logger_1.default.info(header, Logger_1.default.green('Write complete!'));
}
function AceshipJSONParser(locale) {
    if (!AvailableLocales[locale])
        throw new Error(`${locale} is not available.`);
    Logger_1.default.info(locale, Logger_1.default.purple('Init'));
    const localePath = path_1.join(Aceship.BASE_PATH.replace('{locale}', locale));
    Logger_1.default.info(locale, `${Logger_1.default.yellow('Source')}: ${path_1.resolve(localePath)}`);
    const destinationPath = path_1.join(Destination.BASE_JSON_LOCALE_PATH.replace('{locale}', locale));
    Logger_1.default.info(locale, `${Logger_1.default.green('Target')}: ${path_1.resolve(destinationPath)}`);
    createIfNotExist(destinationPath, `Locale-${locale}`);
    parseChar(path_1.join(localePath, Aceship.DATA.characters), destinationPath);
    parseItem(path_1.join(localePath, Aceship.DATA.items), destinationPath);
    Logger_1.default.cout('\n');
}
exports.AceshipJSONParser = AceshipJSONParser;
function parseAll() {
    for (const locale in AvailableLocales)
        AceshipJSONParser(locale);
}
exports.parseAll = parseAll;
class CountTracker {
    constructor(startCount = 0) {
        this._count = 0;
        this._count = startCount;
    }
    get count() { return this._count; }
    add(count) { this._count += count; }
    increment() { this._count++; }
}
parseAll();

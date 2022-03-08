import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ACESHIP_DIR_ROOT, DESTINATION_ROOT } from './Env';
import { CountTracker } from './JSONParser';
import { Logger } from './utils/Logger';
import { createIfNotExist, createRecursive, joinPaths } from './utils/PathUtils';

export const BASE_PATH = '{ACESHIP_DIR_ROOT}/json/'.replace('{ACESHIP_DIR_ROOT}', ACESHIP_DIR_ROOT);

const BASE_TL_JSON_PATH = '{DEST_ROOT}/json/tl-data'.replace('{DEST_ROOT}', DESTINATION_ROOT);

// For array with similar-shaped objects with a key.
function parseTLData(sourceFile: string, preferredObjKeyOrCustomCB: string | ((objSrc: any, targetPath: string) => void), destPath: string): void
{
	const sourcePath = resolve(joinPaths(BASE_PATH, sourceFile));
	const destPathBase = resolve(joinPaths(BASE_TL_JSON_PATH, destPath));

	const srcData = require(sourcePath);

	if (typeof preferredObjKeyOrCustomCB === 'function')
		return preferredObjKeyOrCustomCB(srcData, destPath);

	createRecursive(destPathBase.replace('{key}', ''));
	const preferredObjKey = preferredObjKeyOrCustomCB;
	const success = new CountTracker();
	const failed = new CountTracker();
	const header = `Parsing ${sourceFile}`;
	for (const key of srcData)
	{
		const data = key[preferredObjKey];
		if (data)
		{
			Logger.info(`Parsing ${sourceFile}`, `Writing ${key[preferredObjKey]}...`, false);
			writeFileSync(destPathBase.replace('{key}', `${key[preferredObjKey]}.json`), JSON.stringify(key, null, '\t'));
			Logger.log(null, Logger.green('done'));
			success.increment();
		}
		else
		{
			Logger.error(`Parsing ${sourceFile}`, `Index ${(srcData as any[]).findIndex(v => v === key)} does not have ${preferredObjKey}`);
			failed.increment();
		}
	}
	Logger.info(header, (success.count ? `${Logger.green(success.count)} succeeded` : '') + (failed.count ? `, ${Logger.red(failed.count)} failed` : ''));
}

export function ParseTLData()
{
	parseTLData('tl-akhr.json', 'name_cn', 'human_resource/{key}');
	parseTLData('tl-gender.json', 'sex_cn', 'gender/{key}');
	parseTLData('tl-potential.json', 'skill_cn', 'potentials/{key}');
	parseTLData('tl-unreadablename.json', 'name', 'foreign_names/{key}');
    parseTLData('tl-effect.json', (objSrc: any, targetPath: string) => {
        let source: Record<string, string>;
        try {
            source = require(resolve(joinPaths(DESTINATION_ROOT, 'json/tl-data/paramDesc.json')));
        }
        catch (e) {
            Logger.error(`Parsing tl-effect.json`, `Failed to parse paramDesc.json`);
            source = {}
        }
        let out = Object.assign({}, source);
        for (const key in objSrc)
        {
            out[key] = objSrc[key];
        }
        writeFileSync(resolve(joinPaths(BASE_TL_JSON_PATH, targetPath)), JSON.stringify(out, null, '\t'));
        createRecursive(targetPath);
    }, 'paramDesc.json');
	parseTLData('tl-subclass.json', (objSrc: any, targetPath: string) => {
        let favClassKeys: Record<string, string>;
        // TODO: Fav class key parser
        try {
            favClassKeys = require(resolve(DESTINATION_ROOT, 'json/tl-data/ClassFavKey.json'));
        } catch (e) {
            Logger.error('Parsing tl-subclass.json', 'Failed to parse ClassFavKey.json');
            favClassKeys = {};
        }

		const { list: classList, subclass } = objSrc;
		const out: Record<string, any> = {};
		for (const key in classList)
		{
			const classes = classList[key];
			if (!(key in out)) out[key] = {};
			for (const k of classes)
				out[key][k] = subclass[k];

		}
		writeFileSync(resolve(joinPaths(BASE_TL_JSON_PATH, targetPath)), JSON.stringify(out, null, '\t'));
	}, 'classes.json');
	parseTLData('named_effects.json', (objSrc: any, targetPath: string) => {
		const { termDescriptionDict } = objSrc;
		const destPath = resolve(joinPaths(BASE_TL_JSON_PATH, targetPath.replace('{type}', 'term_descriptions').replace('{key}', '')));
		createRecursive(destPath);
		for (const key in termDescriptionDict)
		{
			Logger.info(`Parsing named_effects.json`, `Writing ${key}...`, false);
			const termDescription = termDescriptionDict[key];
			writeFileSync(resolve(joinPaths(destPath, `${key}.json`)), JSON.stringify(termDescription, null, '\t'));
			Logger.log(null, Logger.green('done'));
		}
	}, 'named_effects/{type}/{key}');
}

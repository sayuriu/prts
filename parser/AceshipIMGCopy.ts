import { ACESHIP_DIR_ROOT, DESTINATION_ROOT } from './AceshipEnv';
import { join } from 'path';
import Logger from './Logger';
import { readdirSync, lstatSync, copyFileSync } from 'fs';
import chalk from 'chalk';
import { createIfNotExist, CountTracker } from './AceshipJSONParser';

export namespace AceshipIMGData {
	export const SOURCE_ROOT = '{ACESHIP_DIR_ENV}\\img'.replace('{ACESHIP_DIR_ENV}', ACESHIP_DIR_ROOT);
	export const DEST_ROOT = '{DESTINATION_ROOT}\\img'.replace('{DESTINATION_ROOT}', DESTINATION_ROOT);
	export const SOURCE = {
		characters_avatars: 'avatars',
		characters_full: 'characters',
		characters_portraits: 'portraits',
		characters_ui_classes: 'classes',
		characters_skills_combat: 'skills',

		characters_ui_chara: 'ui/chara',
		characters_ui_elite: 'ui/elite',
		characters_ui_skillrank: 'ui/rank',
		characters_ui_potential: 'ui/potential',
		characters_skills_infrastructure: 'ui/infrastructure',
		characters_ui_subclasses: 'ui/subclass',

		enemies: 'enemy',
		items: 'items',
		factions: 'factions',
	}
	export const DESTINATION = {
		characters_avatars: 'characters/avatars',
		characters_full: 'characters/characters',
		characters_portraits: 'characters/portraits',
		characters_skills_combat: 'characters/skills/combat',
		characters_skills_infrastructure: 'characters/skills/infrastructure',

		characters_ui_classes: 'characters/ui/classes',
		characters_ui_chara: 'characters/ui/chara',
		characters_ui_elite: 'characters/ui/elite',
		characters_ui_skillrank: 'characters/ui/skillrank',
		characters_ui_potential: 'characters/ui/potential',
		characters_ui_subclasses: 'characters/ui/subclasses',

		enemies: 'enemies',
		items: 'items',
		factions: 'factions',
	}
}

type SourceKey = keyof typeof AceshipIMGData.SOURCE;
export function copyIMG()
{
	const header = 'Images';
	const success = new CountTracker();
	const failed = new CountTracker();
	createIfNotExist(AceshipIMGData.DEST_ROOT);

	for (const key in AceshipIMGData.SOURCE)
	{
		const source = join(AceshipIMGData.SOURCE_ROOT, AceshipIMGData.SOURCE[key as SourceKey]);
		if (!AceshipIMGData.DESTINATION[key as SourceKey])
		{
			Logger.info(header, `${Logger.red(key)} key not found on dest object`);
			continue;
		}
		const destDirArr = AceshipIMGData.DESTINATION[key as SourceKey].split('_');
		let destDirBase = '';
		for (const destDir of destDirArr)
		{
			destDirBase = join(destDirBase, destDir);
			const _destDir = join(AceshipIMGData.DEST_ROOT, destDirBase);
			createIfNotExist(_destDir);
		}
		for (const files of readdirSync(source))
		{
			const _source = join(source, files);
			const _dest = join(AceshipIMGData.DEST_ROOT, destDirBase, files);
			const stats = lstatSync(_source);
			if (stats.isDirectory())
				copyRecursive(_source, _dest, success, failed);
			else if (stats.isFile())
			{
				try {
					Logger.info(header, `Copying ${Logger.yellow(files)}...`, false);
					copyFileSync(_source, _dest);
					Logger.info(null, Logger.green('done'));
					success.increment();
				}
				catch (e: unknown) {
					Logger.error(header, `Failed to copy ${Logger.yellow(files)}`);
					Logger.error(null, (e as NodeJS.ErrnoException).message);
					failed.increment();
				}
			}
		}
	}
	Logger.info(header, (success ? `${Logger.green(success.count)} succeeded` : '') + (failed ? `, ${Logger.red(failed.count)} failed` : ''));
}

function copyRecursive(source: string, dest: string, success = new CountTracker(), failed = new CountTracker())
{
	const header = 'Images';
	createIfNotExist(dest);
	for (const files of readdirSync(source))
	{
		const _source = join(source, files);
		const _dest = join(dest, files);
		const stats = lstatSync(_source);
		if (stats.isDirectory())
			copyRecursive(_source, _dest);
		else if (stats.isFile())
		{
			try {
				Logger.info(header, `Copying ${Logger.yellow(files)}...`, false);
				copyFileSync(_source, _dest);
				Logger.info(null, Logger.green('done'));
				success.increment();
			} catch (e) {
				Logger.info(header, `${Logger.red(files)} failed`, false);
				failed.increment();
			}
		}
	}
}
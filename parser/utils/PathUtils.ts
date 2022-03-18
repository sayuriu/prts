import chalk from "chalk";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Logger } from "./Logger";
import { underline } from "./Ansi";

export const normalizePath = (path: string) => path.replace(/\\\\|\/|\\/g, '/');
export const joinPaths = (...args: string[]) => normalizePath(join(...args));

export function createIfNotExist(path: string, header: string | null = null, silentFound: boolean = false) {
	if (!existsSync(path))
	{
		Logger.info(header, `Attempting to create ${chalk.underline(path)}...`, false);
		mkdirSync(path);
		Logger.log(null, Logger.green('done'))
		return;
	}
	if (!silentFound) Logger.info(header, `${Logger.green('Found')} ${underline(path)}`);
}

export function createRecursive(path: string) {
	const parts = normalizePath(path).split('/');
	let current = '';
	for (let i = 0; i < parts.length; i++)
	{
		current += parts[i] + '/';
		createIfNotExist(current, null, i !== parts.length - 1);
	}
}

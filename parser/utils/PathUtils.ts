import chalk from "chalk";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import Logger from "../Logger";

export const normalizePath = (path: string) => path.replace(/\\\\|\/|\\/g, '/');
export const joinPaths = (...args: string[]) => normalizePath(join(...args));

export function createIfNotExist(path: string, header: string | null = null, silent: boolean = false) {
	if (!existsSync(path))
	{
		Logger.info(header, `Attempting to create ${chalk.underline(path)}...`, false);
		mkdirSync(path);
		Logger.log(null, Logger.green('done'))
		return;
	}
	if (!silent) Logger.info(header, `${Logger.green('Found')} ${chalk.underline(path)}`);
}
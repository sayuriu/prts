import { writeFile } from 'fs';
import { resolve } from 'path';
import { ACESHIP_DIR_ROOT, DESTINATION_ROOT } from './AceshipEnv';
import Logger from './Logger';
import { createIfNotExist, joinPaths } from './utils/PathUtils';

export const BASE_PATH = '{ACESHIP_DIR_ROOT}/json'.replace('{ACESHIP_DIR_ROOT}', ACESHIP_DIR_ROOT);

const BASE_JSON_LOCALE_PATH = '{DEST_ROOT}/json/tl-data'.replace('{DEST_ROOT}', DESTINATION_ROOT);

function ParseTLData(sourceFile: string, destPath: string, preferredObjKey: string)
{
	const sourcePath = resolve(joinPaths(BASE_PATH, sourceFile));
	const destFile = resolve(joinPaths(destPath, sourceFile));


}

// ParseTLData('tl-akhr.json', 'tl/human_resource/{key}', 'name_cn');
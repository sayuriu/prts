import https from 'https';
import { writeJSON } from "./JSONParser";
import { Logger } from "./utils/Logger";
import { createIfNotExist, joinPaths } from "./utils/PathUtils";
import ErrnoException = NodeJS.ErrnoException;

interface PenguinStatsDataModel {
    stageId: string,
    itemId: string,
    quantity: number,
    times: number,
    start: number,
    end: number
}

const servers = {
    'US': 'en_US',
    'CN': 'zh_CN',
    'TW': 'zh_TW',
    'JP': 'ja_JP',
    'KR': 'ko_KR',
}

export function PenguinDownload()
{
    const header = 'PenguinStats';
    const url = 'https://penguin-stats.io/PenguinStats/api/v2/result/matrix?is_personal=false&server={@server}&show_closed_zones=true'

    const matData: Record<string, any> = {};
    for (const server in servers)
    {
        https.get(
            url.replace('{@server}', server),
            (res) => {
                let data = '';
                let length = 0;
                if (res.statusCode === 200)
                {
                    Logger.success(header, `Status code ${res.statusCode}`);
                    length = parseInt(res.headers['content-length'] ?? '0');
                    Logger.info(header, 'Attempting to download ' + length + ' bytes of JSON');
                }
                else if (res.statusCode ?? 600 >= 500)
                    Logger.error(header, `Status code ${res.statusCode}`);
                else
                    Logger.info(header, `Status code ${res.statusCode}`);

                res.on('error', (err) => {
                    Logger.error(header, err.message);
                    Logger.error(header, 'All temporary data will be deleted.');
                    data = '';
                });

                // let downloadProg = false;
                res.on('data', (chunk) => {
                    data += chunk;
                    // if (downloadProg)
                    //     process.stdout.clearLine(0);
                    // process.stdout.cursorTo(0);
                    // process.stdout.write(`[${Logger.cyan(header)}] Downloading ${data.length}/${length} bytes (${Number((data.length / length * 100).toFixed(2))}%)`);
                });
                res.on('end', () => {
                    // process.stdout.clearLine(0);
                    // process.stdout.cursorTo(0);
                    Logger.success(header, 'Download complete');
                    matData[server] = JSON.parse(data);
                    writeJSON('penguinMatDataRaw.json', matData);
                });
            }
        );
    }
}

export function PenguinParse(baseGameLocalePath: string)
{
    const data = require('./penguinMatDataRaw.json');
    for (const server in data)
    {
        const header = 'PenguinStats-' + server;
        const out: Record<string, any> = {};
        const outPath = joinPaths(
            baseGameLocalePath.replace('{locale}', servers[server as keyof typeof servers]),
            'items/drop-rates'
        );
        createIfNotExist(outPath);
        if (data[server].violations?.length)
        {
            Logger.error(header, data[server].violations.length + ' violations found');
            continue;
        }
        const serverData = data[server].matrix as PenguinStatsDataModel[];
        for (const dropData of serverData)
        {
            const { stageId, itemId, quantity, times, start, end } = dropData;
            if (!out[itemId])
                out[itemId] = {};
            out[itemId][stageId] = {
                quantity,
                times,
                start,
                end
            };
        }
        for (const itemId in out)
        {
            Logger.info(header, `Writing ${itemId}`, false);
            try {
                //! This call is async, log will never hit
                writeJSON(joinPaths(outPath, itemId + '.json'), out[itemId]);
                Logger.green('done\n');
            } catch (err) {
                Logger.red('failed\n');
                Logger.error(header, (err as ErrnoException).message);
            }
        }
    }
}

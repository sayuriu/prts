import { Injectable } from '@angular/core';
import { environment } from "@root/src/environments/environment";


@Injectable({
	providedIn: 'root'
})
export class LogService {

    isDebugMode = !environment.production;
	constructor() { }
	info(message: any, args: any[] = [], payload: any = null)
	{
        this.rawLog(
            [
                '%cInfo',
                `%c${message}`,
            ].join(' '),
            ...this.prependStyles(['color: #0099ff'].concat(args ?? [])),
        )
        if (payload)
            this.rawLog(payload);
	}
    prependStyles(args: string[])
    {
        for (let i = 1; i < args.length; i++)
        {
            args[i] += (args[i].endsWith(';') ? '' : ';') + 'font-family: JetBrains Mono;';
        }
        return args;
    }
    debug(message: any, args: any[] = [], payload: any = null)
    {
        if (!this.isDebugMode) return;
        this.rawLog(
            [
                '%cDebug',
                `%c${message}`,
            ].join(' '),
            ...this.prependStyles(['color: #0099ff'].concat(args ?? [])),
        )
        if (payload)
            this.rawLog(payload);

    }
    rawLog(...data: any[])
    {
        console.log(...data);
    }
}

interface LogPayload {
    message: string;
    args?: any[];
    payload?: any;
}

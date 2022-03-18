import chalk from "chalk";
import { background as bg, foreground as fg } from "./Ansi";

export class Logger {
    public static readonly logLevels = {
        // normal: '#ffffff',
        info: '#00cccc',
        warn: '#ff9900',
        error: '#ff0000',
        success: '#009900',
        black: '#000000',
    };
    public static readonly logLevelsWithBackground = {
        warn: '#000000',
        error: '#ffffff',
    };
    public static log(header: string | null, message: string, eol = true) {
        if (header)
            cout(header ? header : '', message);
        else cout(message + (eol ? '\n' : ''));
    }
    public static info(header: string | null, message: string, eol = true) {
        const color = chalk.hex(Logger.logLevels.info);
        // const color = fg(Logger.logLevels.info);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else cout(body);
    }
    public static warn(header: string | null, message: string, eol = true) {
        const color = chalk.bgHex(Logger.logLevels.warn).hex(Logger.logLevelsWithBackground.warn);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
            // cout(`[${bg(Logger.logLevels.warn)(fg(Logger.logLevelsWithBackground.warn)(header))}]`, body);
        else cout(body);
    }
    public static error(header: string | null, message: string, eol = true) {
        const color = chalk.bgHex(Logger.logLevels.warn).hex(Logger.logLevelsWithBackground.warn);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
            // cout(`[${bg(Logger.logLevels.error)(fg(Logger.logLevelsWithBackground.warn)(header))}]`, body);
        else cout(body);
    }
    public static success(header: string | null, message: string, eol = true) {
        const color = chalk.bgHex(Logger.logLevels.success);
        // const color = bg(Logger.logLevels.success);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else cout(body);
    }
    static readonly green = (input: any) => chalk.hex(Logger.logLevels.success)(new String(input).valueOf());
    static readonly red = (input: any) => chalk.hex(Logger.logLevels.error)(new String(input).valueOf());
    static readonly yellow = (input: any) => chalk.hex(Logger.logLevels.warn)(new String(input).valueOf());
    static readonly cyan = (input: any) => chalk.hex(Logger.logLevels.info)(new String(input).valueOf());
    static readonly purple = (input: any) => chalk.magenta(new String(input).valueOf());
    // static readonly green = (input: any) => fg(Logger.logLevels.success)(new String(input).valueOf());
    // static readonly red = (input: any) => fg(Logger.logLevels.error)(new String(input).valueOf());
    // static readonly yellow = (input: any) => fg(Logger.logLevels.warn)(new String(input).valueOf());
    // static readonly cyan = (input: any) => fg(Logger.logLevels.info)(new String(input).valueOf());
    // static readonly purple = (input: any) => fg('#ff00ff')(new String(input).valueOf());
    static readonly cout = cout;
}


function cout(...str: string[]) {
	process.stdout.write(str.join(' '));
}

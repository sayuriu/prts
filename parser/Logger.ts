import chalk from 'chalk';

export default class Logger {
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
			cout(header ? header : '', );
		else cout(message + (eol ? '\n' : ''));
	}
	public static info(header: string | null, message: string, eol = true) {
		const color = chalk.hex(Logger.logLevels.info);
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
		else cout(body);
	}
	public static error(header: string | null, message: string, eol = true) {
		const color = chalk.bgHex(Logger.logLevels.error).hex(Logger.logLevelsWithBackground.error);
		const body = message + (eol ? '\n' : '');
		if (header)
			cout(`[${color(header)}]`, body);
		else cout(body);
	}
	public static success(header: string | null, message: string, eol = true) {
		const color = chalk.bgHex(Logger.logLevels.success);
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
	static readonly cout = cout;
}

function cout(...str: string[]) {
	process.stdout.write(str.join(' '));
}
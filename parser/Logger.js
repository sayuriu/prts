"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class Logger {
    static log(header, message, eol = true) {
        if (header)
            cout(header ? header : '');
        else
            cout(message + (eol ? '\n' : ''));
    }
    static info(header, message, eol = true) {
        const color = chalk_1.default.hex(Logger.logLevels.info);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else
            cout(body);
    }
    static warn(header, message, eol = true) {
        const color = chalk_1.default.bgHex(Logger.logLevels.warn).hex(Logger.logLevelsWithBackground.warn);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else
            cout(body);
    }
    static error(header, message, eol = true) {
        const color = chalk_1.default.bgHex(Logger.logLevels.error).hex(Logger.logLevelsWithBackground.error);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else
            cout(body);
    }
    static success(header, message, eol = true) {
        const color = chalk_1.default.bgHex(Logger.logLevels.success);
        const body = message + (eol ? '\n' : '');
        if (header)
            cout(`[${color(header)}]`, body);
        else
            cout(body);
    }
}
exports.default = Logger;
Logger.logLevels = {
    // normal: '#ffffff',
    info: '#00cccc',
    warn: '#ff9900',
    error: '#ff0000',
    success: '#009900',
    black: '#000000',
};
Logger.logLevelsWithBackground = {
    warn: '#000000',
    error: '#ffffff',
};
Logger.green = (input) => chalk_1.default.hex(Logger.logLevels.success)(new String(input).valueOf());
Logger.red = (input) => chalk_1.default.hex(Logger.logLevels.error)(new String(input).valueOf());
Logger.yellow = (input) => chalk_1.default.hex(Logger.logLevels.warn)(new String(input).valueOf());
Logger.cyan = (input) => chalk_1.default.hex(Logger.logLevels.info)(new String(input).valueOf());
Logger.purple = (input) => chalk_1.default.magenta(new String(input).valueOf());
Logger.cout = cout;
function cout(...str) {
    process.stdout.write(str.join(' '));
}

const isDev = import.meta.env.DEV;

type LogLevel = 'debug' | 'log' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
    debug: 0,
    log: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private _level: LogLevel;
    private _enabled: boolean;
    private _prefix: string;

    constructor(prefix: string = 'Canvas', level: LogLevel = 'log') {
        this._prefix = prefix;
        this._level = level;
        this._enabled = isDev;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }

    get level(): LogLevel {
        return this._level;
    }

    set level(value: LogLevel) {
        this._level = value;
    }

    private _shouldLog(level: LogLevel): boolean {
        return this._enabled && levels[level] >= levels[this._level];
    }

    private _formatMessage(level: string, message: string): string[] {
        const timestamp = new Date().toISOString().slice(11, 23);
        return [`[${timestamp}] [${this._prefix}] [${level.toUpperCase()}]`, message];
    }

    debug(...args: any[]): void {
        if (this._shouldLog('debug')) {
            console.debug(...this._formatMessage('debug', args[0]), ...args.slice(1));
        }
    }

    log(...args: any[]): void {
        if (this._shouldLog('log')) {
            console.log(...this._formatMessage('log', args[0]), ...args.slice(1));
        }
    }

    warn(...args: any[]): void {
        if (this._shouldLog('warn')) {
            console.warn(...this._formatMessage('warn', args[0]), ...args.slice(1));
        }
    }

    error(...args: any[]): void {
        if (this._shouldLog('error')) {
            console.error(...this._formatMessage('error', args[0]), ...args.slice(1));
        }
    }

    group(label?: string): void {
        if (this._enabled) {
            console.group(label);
        }
    }

    groupEnd(): void {
        if (this._enabled) {
            console.groupEnd();
        }
    }

    time(label: string): void {
        if (this._enabled) {
            console.time(label);
        }
    }

    timeEnd(label: string): void {
        if (this._enabled) {
            console.timeEnd(label);
        }
    }
}

/** 全局默认 logger 实例 */
export const logger = new Logger('Canvas');

/** 创建一个带命名空间的 logger */
export function createLogger(name: string): Logger {
    return new Logger(name);
}

export { Logger };

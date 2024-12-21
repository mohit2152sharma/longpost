import path from 'path';
import { PUBLIC_LOG_LEVEL } from '$env/static/public';

enum LogLevel {
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error'
}

export class Logger {
	level: LogLevel;

	constructor(level?: string | LogLevel) {
		this.level = this.getLogLevel(level);
	}

	// BUG: unable to extract function from deeply nested stack
	private getCallerInfo() {
		const stack = new Error().stack;
		const callerLine = stack?.split('\n')[5].trim();
		const functionName = callerLine?.match(/at\s+(\w+)\s+/)?.[1];
		const filePath = callerLine?.match(/\((.*)\)/)?.[1];
		const fileName = filePath ? path.basename(filePath).split(':')[0] : undefined;
		return { fileName: fileName, functionName: functionName };
	}

	formatMessage(message: string, level: LogLevel) {
		const { fileName, functionName } = this.getCallerInfo();
		const dateTime = new Date().toLocaleString();
		return `${dateTime} - level:${level} - fileName:${fileName} - function:${functionName} - message:${message}`;
	}

	getLogLevel(level?: string | LogLevel) {
		if (!level) {
			// check if LOG_LEVEL is set in environment
			level = typeof window === 'undefined' ? PUBLIC_LOG_LEVEL : PUBLIC_LOG_LEVEL;
			if (!level) {
				return LogLevel.INFO;
			}
		}
		switch (level) {
			case 'debug':
				return LogLevel.DEBUG;
			case 'info':
				return LogLevel.INFO;
			case 'warn':
				return LogLevel.WARN;
			case 'error':
				return LogLevel.ERROR;
			default:
				return LogLevel.INFO;
		}
	}

	log(message: string, level?: LogLevel) {
		if (!level) {
			level = this.level;
		}
		const msg = this.formatMessage(message, level);
		switch (level) {
			case LogLevel.DEBUG:
				console.debug(msg);
				break;
			case LogLevel.INFO:
				console.info(msg);
				break;
			case LogLevel.WARN:
				console.warn(msg);
				break;
			case LogLevel.ERROR:
				console.error(msg);
				break;
		}
	}

	debug(message: string) {
		this.log(message, LogLevel.DEBUG);
	}

	info(message: string) {
		this.log(message, LogLevel.INFO);
	}

	warn(message: string) {
		this.log(message, LogLevel.WARN);
	}

	error(message: string) {
		this.log(message, LogLevel.ERROR);
	}
}

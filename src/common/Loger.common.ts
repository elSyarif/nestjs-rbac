import { LoggerService } from '@nestjs/common';

export class Logger implements LoggerService {
	log(message: any, ...optionalParams: any[]) {
		return message;
	}

	error(message: any, stack?: string, context?: string) {
		return message;
	}

	warn(message: any, ...optionalParams: any[]) {
		return message;
	}

	debug?(message: any, ...optionalParams: any[]) {
		return message;
	}

	verbose?(message: any, ...optionalParams: any[]) {
		return message;
	}
}

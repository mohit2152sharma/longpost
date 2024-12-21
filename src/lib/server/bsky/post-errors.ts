import { MAX_IMAGE_SIZE } from '$lib/constants';

class BasePostError extends Error {
	public code: string;
	public message: string;
	public details?: string;

	constructor(code: string, message: string, details?: string) {
		super(message);
		this.code = code;
		this.message = message;
		this.details = details;
		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export class ErrorPostImageSize extends BasePostError {
	constructor(message: string) {
		super('POST_IMAGE_SIZE_ERROR', message, `Max allowed size is ${MAX_IMAGE_SIZE}`);
	}
}

export class ErrorPostUploadImage extends BasePostError {
	constructor(message: string, details?: string) {
		super('POST_IMAGE_UPLOAD_ERROR', message, details);
	}
}

export class ErrorPostCreate extends BasePostError {
	constructor(message: string, details?: string) {
		super('POST_CREATE__ERROR', message, details);
	}
}

export class ErrorThreaderInvalidImageTag extends BasePostError {
	constructor(message: string) {
		super('THREADER_INVALID_IMAGE_TAG', message);
	}
}

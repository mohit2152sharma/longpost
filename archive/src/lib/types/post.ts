import { RichText } from '@atproto/api';

interface BskyPost {
	$type: string;
	text: string;
	facets?: RichText['facets'];
	createdAt: string;
	reply?: BskyReply;
}

interface ParsedValues {
	content: string;
	shoutout: boolean;
}

interface BskyPostResponse {
	uri: string;
	cid: string;
	commit: {
		cid: string;
		rev: string;
	};
	validationStatus: string;
}

interface SessionData {
	accessJwt: string;
	did: string;
}

interface CreateRecordRequest {
	repo: string;
	collection: string;
	record: BskyPost;
}

interface Reply {
	uri: string;
	cid: string;
}

interface BskyReply {
	root?: Reply;
	parent?: Reply;
}

export type {
	BskyPostResponse,
	BskyPost,
	SessionData,
	CreateRecordRequest,
	BskyReply,
	ParsedValues
};

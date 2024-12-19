import { z } from 'zod';
import { RichText } from '@atproto/api';

const LoginCredentialsSchema = z.object({
	identifier: z.string().min(1),
	password: z.string().min(1)
});

interface AuthResponse {
	token: string;
}

interface User {
	isAuthenticated: boolean;
	token: string | null;
}

type LoginCredentialsSchemaType = z.infer<typeof LoginCredentialsSchema>;

interface BskyPost {
	$type: string;
	text: string;
	facets?: RichText['facets'];
	createdAt: string;
	reply?: BskyReply;
	embed?: ImageEmbed;
}

const BskyContentSchema = z.object({
	content: z.string().min(1),
	shoutout: z.boolean().optional().default(true)
});

type BskyContentSchemaType = z.infer<typeof BskyContentSchema>;

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
	refreshJwt: string;
	handle: string;
	userId?: string;
	isSubscribed?: boolean;
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

type ImageMimeType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

interface ImageBlobType {
	$type: string;
	ref: {
		$link: string;
	};
	mimeType: ImageMimeType;
	size: number;
}

interface ImageEmbedProps {
	alt: string;
	image: ImageBlobType;
	aspectRatio: {
		width: number;
		height: number;
	};
}

interface ImageEmbed {
	$type: string;
	images: Array<ImageEmbedProps>;
}

export { LoginCredentialsSchema, BskyContentSchema };

export type {
	LoginCredentialsSchemaType,
	AuthResponse,
	User,
	BskyPostResponse,
	BskyPost,
	BskyContentSchemaType,
	SessionData,
	CreateRecordRequest,
	BskyReply,
	ImageMimeType,
	ImageBlobType,
	ImageEmbedProps,
	ImageEmbed
};

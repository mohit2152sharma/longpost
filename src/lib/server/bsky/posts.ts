import type {
	BskyPost,
	SessionData,
	CreateRecordRequest,
	BskyPostResponse,
	BskyReply,
	BskyContentSchemaType,
	ImageMimeType,
	ImageEmbed,
	ImageBlobType,
	ImageEmbedProps
} from '$lib/server/bsky/types';
import { BskyAgent, RichText } from '@atproto/api';
import { type Post, createThread } from './threader';
import fs from 'fs';
import type { CodeImage } from './code-images';
import { removeFile, retryFetch } from '$lib/lib-utils';
import { Logger } from '$lib/logger';

const logger = new Logger();
const PDS_URL = 'https://bsky.social';
const CHARACTER_LIMIT = 300;
const MAX_IMAGE_SIZE = 1000000;

async function bskyUploadImage(
	pdsUrl: string,
	imagePath: string,
	session: SessionData,
	imageMimeType: ImageMimeType,
	retry: boolean = true,
	retryLimit: number = 3
): Promise<ImageBlobType> {
	const imageBytes = await fs.promises.readFile(imagePath);
	if (imageBytes.length > MAX_IMAGE_SIZE) {
		throw new Error(
			`Image size (${imageBytes.length}) is too large. Max size is ${MAX_IMAGE_SIZE} bytes.`
		);
	}

	const fetchUrl = `${pdsUrl}/xrpc/com.atproto.repo.uploadBlob`;
	const resp = await retryFetch(
		fetchUrl,
		'POST',
		{
			Authorization: `Bearer ${session.accessJwt}`,
			'Content-Type': imageMimeType
		},
		imageBytes,
		retry,
		retryLimit
	);

	if (!resp.ok) {
		throw new Error(`Failed to upload image: ${resp.statusText}`);
	} else {
		const data = await resp.json();
		const blob = data['blob'] as ImageBlobType;
		return blob;
	}
}

async function uploadImages(
	images: Array<CodeImage>,
	session: SessionData,
	pdsUrl: string,
	retry: boolean = true,
	retryLimit: number = 3
): Promise<Array<ImageBlobType>> {
	const blobs: Array<ImageBlobType> = [];
	for (const image of images) {
		try {
			const blob = await bskyUploadImage(
				pdsUrl,
				image.imageProperties.outputPath,
				session,
				'image/png',
				retry,
				retryLimit
			);
			blobs.push(blob);
		} catch (error) {
			logger.error(`Failed to upload image: ${error}`);
			throw error
		} finally {
			await removeFile(image.imageProperties.outputPath);
		}
	}
	return blobs;
}

async function createEmbed(images: Array<CodeImage>, blobs: Array<ImageBlobType>) {
	const embed: ImageEmbed = {
		$type: 'app.bsky.embed.images',
		images: []
	};
	for (const [index, image] of images.entries()) {
		const blob = blobs[index];
		const imageProps = image.imageProperties;
		const imageEmbedProps: ImageEmbedProps = {
			alt: image.code,
			image: blob,
			aspectRatio: {
				width: imageProps.width,
				height: imageProps.height
			}
		};
		embed.images.push(imageEmbedProps);
	}
	return embed;
}

// TODO: Do proper error handling to propagate to the end user if upload fails
async function createBskyPost(
	agent: BskyAgent,
	pdsUrl: string = PDS_URL,
	session: SessionData,
	post: Post,
	reply?: BskyReply
): Promise<BskyPostResponse> {
	const now = new Date().toISOString();
	const rt = new RichText({ text: post.text });
	await rt.detectFacets(agent);
	const bskyPost: BskyPost = {
		$type: 'app.bsky.feed.post',
		text: rt.text,
		facets: rt.facets,
		createdAt: now,
		reply: reply
	};
	// if post has images, uplaod them
	// TODO: Add cleanup files once the post is uploaded
	if (post.images && post.images.length > 0) {
		const blobs = await uploadImages(post.images, session, pdsUrl);
		bskyPost.embed = await createEmbed(post.images, blobs);
	}

	const requestBody: CreateRecordRequest = {
		repo: session.did,
		collection: 'app.bsky.feed.post',
		record: bskyPost
	};

	const response = await retryFetch(
		`${pdsUrl}/xrpc/com.atproto.repo.createRecord`,
		'POST',
		{
			Authorization: `Bearer ${session.accessJwt}`,
			'Content-Type': 'application/json'
		},
		JSON.stringify(requestBody),
		true,
		2
	);

	if (!response.ok) {
		throw new Error(`Failed to create post: ${response.statusText}`);
	} else {
		logger.info('Post created successfully');
		return await response.json();
	}
}

// TODO: Add environment variable or option to not post to bsky when in development instead log to console
async function bskyThreads(
	pdsURL: string = PDS_URL,
	session: SessionData,
	parsedValues: BskyContentSchemaType,
	characterLimit: number = CHARACTER_LIMIT
) {
	const text = parsedValues.content;
	const shoutout = parsedValues.shoutout;
	const { posts, error, message } = await createThread(text, shoutout, characterLimit);
	if (error) {
		return { error: error, message: message, success: false };
	}
	try {
		const agent = new BskyAgent({ service: pdsURL });
		const post0 = posts?.shift() as Post;
		const bskyPost0 = await createBskyPost(agent, pdsURL, session, post0);
		let reply: BskyReply = {
			root: { cid: bskyPost0.cid, uri: bskyPost0.uri },
			parent: { cid: bskyPost0.cid, uri: bskyPost0.uri }
		};

		for (const post of posts as Post[]) {
			const bskyPost = await createBskyPost(agent, pdsURL, session, post, reply);
			reply = {
				root: { cid: bskyPost0.cid, uri: bskyPost0.uri },
				parent: { cid: bskyPost.cid, uri: bskyPost.uri }
			};
		}
		return { error: false, message: '', success: true };
	} catch (error) {
		return {
			error: true,
			message: error instanceof Error ? error.message : String(error),
			success: false
		};
	}
}

// NOTE: This function was used for mocking. Keep it???
// async function bskyThreads(
//   pdsURL: string = PDS_URL,
//   session: SessionData,
//   text: string,
//   characterLimit: number = CHARACTER_LIMIT,
// ): Promise<{ error: boolean; message: string; success: boolean }> {
//   await new Promise((resolve) => setTimeout(resolve, 5000));
//   return { error: true, message: "Failed to post", success: false };
// }

export {
	createBskyPost,
	PDS_URL,
	createThread,
	bskyThreads,
	uploadImages,
	createEmbed,
	bskyUploadImage
};

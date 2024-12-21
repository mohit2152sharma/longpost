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
import { MAX_IMAGE_SIZE, PDS_URL, CHARACTER_LIMIT } from '$lib/constants';
import * as postErrors from '$lib/server/bsky/post-errors';

const logger = new Logger();

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
		throw new postErrors.ErrorPostImageSize(`Image size (${imageBytes.length}) is too large.`);
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
		throw new postErrors.ErrorPostUploadImage(`Failed to upload image: ${resp.statusText}`);
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
			throw error;
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
		throw new postErrors.ErrorPostCreate(`Failed to create post: ${response.statusText}`);
	} else {
		logger.info('Post created successfully');
		return await response.json();
	}
}

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
		return { message: message, success: false };
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
		return { message: 'Post created successfully', success: true };
	} catch (error) {
		logger.error(String((error as Error).stack));
		const toReturn = { message: '', success: false };
		if (error instanceof postErrors.ErrorPostImageSize) {
			toReturn.message =
				'Image size is too large, try reducing the size of the image by splitting your code into multiple code snippets';
		} else if (error instanceof postErrors.ErrorPostUploadImage) {
			toReturn.message = 'Failed to upload image, please try again after some time';
		} else if (error instanceof postErrors.ErrorPostCreate) {
			toReturn.message = 'Failed to create post, please try again after some time';
		} else if (error instanceof postErrors.ErrorThreaderInvalidImageTag) {
			toReturn.message = error.message;
		} else {
			const msg = error instanceof Error ? error.message : String(error);
			toReturn.message = `Encountered error: ${msg}, please try after some time`;
		}
		return toReturn;
	}
}

export {
	createBskyPost,
	PDS_URL,
	createThread,
	bskyThreads,
	uploadImages,
	createEmbed,
	bskyUploadImage
};

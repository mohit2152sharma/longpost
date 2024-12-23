import { type CodeImage, type CodeSnippet, extractCode, renderCodeSnippet } from './code-images';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import { ErrorThreaderInvalidImageTag } from './post-errors';
import { Logger } from '$lib/logger';
import { SHOUTOUT_MESSAGE } from '$lib/constants';

const logger = new Logger();

type CodeImages = Array<CodeImage>;
type Post = { text: string; images?: CodeImages };

async function getThreadLength(posts: Array<Post>, shoutout: boolean) {
	const threadLength = shoutout ? posts.length + 1 : posts.length;
	return threadLength;
}

async function addCounter(posts: Array<Post>, threadLength: number, characterLimit: number = 300) {
	for (let i = 0; i < posts.length; i++) {
		const index = ` (${i + 1}/${threadLength})`;
		if ((posts[i].text + index).length <= characterLimit) {
			posts[i].text = posts[i].text + index;
		}
	}
	return posts;
}

async function addShoutout(posts: Array<Post>, shoutout: boolean, shoutoutMessage?: string) {
	if (shoutout) {
		if (!shoutoutMessage) {
			shoutoutMessage = SHOUTOUT_MESSAGE;
		}
		posts.push({ text: shoutoutMessage });
	}
	return posts;
}

async function addImagesToPosts(posts: Array<Post>, codeImages: CodeImages) {
	for (const [postIndex, post] of posts.entries()) {
		const imageTitles = [...post.text.matchAll(/(?<=\[)(image_\d+)(?=\])/g)];
		if (imageTitles.length > 0) {
			for (const imageTitle of imageTitles) {
				const image = codeImages.find((image) => image.title === imageTitle[1]);
				if (!image) {
					throw new ErrorThreaderInvalidImageTag(
						`Found an image title tag but no associated code snippet. Remove image title tag or add a code snippet. imageTitle: ${imageTitle[1]}`
					);
				} else {
					if (!post.images) {
						post.images = [image];
					} else if (post.images.length < 4) {
						post.images.push(image);
					} else {
						let index = postIndex + 1;
						while (true) {
							if (index >= posts.length) {
								posts.push({ text: '', images: [image] });
								break;
							} else if (!posts[index].images) {
								posts[index].images = [image];
								break;
							} else if (posts[index].images!.length < 4) {
								posts[index].images!.push(image);
								break;
							} else {
								index++;
							}
						}
					}
				}
			}
		}
	}
	return posts;
}

async function createThread(
	text: string,
	shoutout: boolean,
	characterLimit: number,
	buffer: number = 5
): Promise<{ posts?: Array<Post>; error: boolean; message: string }> {
	const codeSnippets: Array<CodeSnippet> = await extractCode(text);
	const codeImages: Array<CodeImage> = [];
	if (codeSnippets.length !== 0) {
		for (const [index, snippet] of codeSnippets.entries()) {
			const title = `image_${index + 1}`;
			text = text.replace(snippet.codeSnippet, `[${title}]`);
			const imageId = crypto.randomUUID();
			const imageName = `code-image-${imageId}.png`;
			const imagePath = path.join(os.tmpdir(), imageName);
			const codeImage = await renderCodeSnippet(snippet, imagePath, { imageTitle: title });
			codeImages.push(codeImage);
		}
	}

	const words = text
		.split(/\s+/)
		.map((w) => w.trim())
		.filter((w) => w.length > 0);
	let posts: Array<Post> = [{ text: '' }];

	for (let i = 0; i < words.length; i++) {
		const sentence = posts[posts.length - 1].text;
		if (words[i].length > characterLimit) {
			return {
				posts: undefined,
				error: true,
				message: 'Characters in word are greater than character limit'
			};
		} else if ((sentence + ' ' + words[i]).length + buffer <= characterLimit) {
			posts[posts.length - 1].text = (sentence + ' ' + words[i]).trim();
		} else {
			posts.push({ text: words[i] });
		}
	}

	posts = posts.filter((w) => w.text.length > 0);
	try {
		posts = await addImagesToPosts(posts, codeImages);
	} catch (error) {
		logger.error(String(error));
		if (error instanceof ErrorThreaderInvalidImageTag) {
			return { posts: undefined, error: true, message: error.message };
		} else {
			return {
				posts: undefined,
				error: true,
				message: 'Unknown error while converting code snippets to images please try after some time'
			};
		}
	}
	const threadLength = await getThreadLength(posts, shoutout);
	posts = await addCounter(posts, threadLength, characterLimit);
	posts = await addShoutout(posts, shoutout);
	return { posts, error: false, message: '' };
}

export {
	type Post,
	type CodeImages,
	createThread,
	addCounter,
	getThreadLength,
	addShoutout,
	addImagesToPosts
};

import {
	BskyPost,
	SessionData,
	CreateRecordRequest,
	BskyPostResponse,
	BskyReply,
	ParsedValues
} from '~/lib/types/post';
import { BskyAgent, RichText } from '@atproto/api';

const PDS_URL = 'https://bsky.social';
const CHARACTER_LIMIT = 300;

async function createBskyPost(
	agent: BskyAgent,
	pdsUrl: string = PDS_URL,
	session: SessionData,
	text: string,
	reply?: BskyReply
): Promise<BskyPostResponse> {
	const now = new Date().toISOString();
	const rt = new RichText({ text: text });
	await rt.detectFacets(agent);

	const post: BskyPost = {
		$type: 'app.bsky.feed.post',
		text: rt.text,
		facets: rt.facets,
		createdAt: now,
		reply: reply
	};

	const requestBody: CreateRecordRequest = {
		repo: session.did,
		collection: 'app.bsky.feed.post',
		record: post
	};

	const response = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${session.accessJwt}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		throw new Error(`Failed to create post: ${response.statusText}`);
	} else {
		console.log('Post created successfully');
		return await response.json();
	}
}

function createThread(
	text: string,
	shoutout: boolean,
	characterLimit: number = CHARACTER_LIMIT,
	buffer: number = 5
): { texts?: Array<string>; error: boolean; message: string } {
	const words = text
		.split(/\s+/)
		.map((w) => w.trim())
		.filter((w) => w.length > 0);
	let postTexts: Array<string> = [''];

	for (let i = 0; i < words.length; i++) {
		const sentence = postTexts[postTexts.length - 1];
		if (words[i].length > characterLimit) {
			return {
				texts: undefined,
				error: true,
				message: 'Characters in word are greater than character limit'
			};
		} else if ((sentence + ' ' + words[i]).length + buffer <= characterLimit) {
			postTexts[postTexts.length - 1] = (sentence + ' ' + words[i]).trim();
		} else {
			postTexts.push(words[i]);
		}
	}
	postTexts = postTexts.filter((w) => w.length > 0);
	const texts: Array<string> = [];
	const threadLength = shoutout ? postTexts.length + 1 : postTexts.length;
	for (let i = 0; i < postTexts.length; i++) {
		const index = ` (${i + 1}/${threadLength})`;
		if ((postTexts[i] + index).length <= characterLimit) {
			texts[i] = postTexts[i] + index;
		} else {
			texts[i] = postTexts[i];
		}
	}

	if (shoutout) {
		texts.push(
			`This thread was created by Longpost. Try it out at: https://mohit2152sharma.github.io/bsky-projects/ (${threadLength}/${threadLength})`
		);
	}
	return { texts: texts, error: false, message: '' };
}

async function bskyThreads(
	pdsURL: string = PDS_URL,
	session: SessionData,
	parsedValues: ParsedValues,
	// text: string,
	characterLimit: number = CHARACTER_LIMIT
) {
	let text = parsedValues.content;
	const shoutout = parsedValues.shoutout;
	const { texts, error, message } = createThread(text, shoutout, characterLimit);
	if (error) {
		return { error: error, message: message, success: false };
	}
	try {
		const agent = new BskyAgent({ service: pdsURL });
		const text0 = texts?.shift() as string;
		const post0 = await createBskyPost(agent, pdsURL, session, text0);
		let reply: BskyReply = {
			root: { cid: post0.cid, uri: post0.uri },
			parent: { cid: post0.cid, uri: post0.uri }
		};

		for (text of texts as string[]) {
			const post = await createBskyPost(agent, pdsURL, session, text, reply);
			reply = {
				root: { cid: post0.cid, uri: post0.uri },
				parent: { cid: post.cid, uri: post.uri }
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

export { createBskyPost, PDS_URL, createThread, bskyThreads };

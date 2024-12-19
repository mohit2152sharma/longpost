import { eq } from 'drizzle-orm';
import { db } from './index';
import {
	posts,
	subscriptions,
	users,
	type PostInsert,
	type PostSelect,
	type SubscriptionInsert,
	type SubscriptionSelect,
	type UserInsert,
	type UserSelect
} from './schema';
import { onlyOneParam } from '$lib/lib-utils';
import { Logger } from '$lib/logger';

const logger = new Logger();

export const getUser = async ({
	id,
	did
}: {
	id?: string;
	did?: string;
}): Promise<Array<UserSelect>> => {
	onlyOneParam(id, did);
	const colName = id ? users.id : users.did;
	const matchValue = id ? id : did ? did : undefined;
	if (!matchValue) {
		throw new Error('id or did cannot be undefined, at least one of them must be defined');
	}
	const user = await db.select().from(users).where(eq(colName, matchValue));
	return user;
};

export const getPost = async (id: string): Promise<Array<PostSelect>> => {
	const post = await db.select().from(posts).where(eq(posts.postId, id));
	return post;
};

export const insertUser = async (user: UserInsert): Promise<Array<UserSelect>> => {
	return await db.insert(users).values(user).returning();
};

export const insertPost = async (post: PostInsert): Promise<Array<PostSelect>> => {
	return await db.insert(posts).values(post).returning();
};

export const updateUser = async (id: string, user: UserInsert): Promise<Array<UserSelect>> => {
	return await db.update(users).set(user).where(eq(users.id, id)).returning();
};

export const updatePost = async (id: string, post: PostInsert): Promise<Array<PostSelect>> => {
	return await db.update(posts).set(post).where(eq(posts.postId, id)).returning();
};

export const checkAndInsertNewUser = async (user: UserInsert): Promise<Array<UserSelect>> => {
	const existingUser = await getUser({ did: user.did });
	if (existingUser.length === 0) {
		logger.info("User doesn't exist in db inserting");
		return await insertUser(user);
	} else {
		logger.info('User already exists');
	}
	return existingUser;
};

export const insertNewSubscriber = async (
	subscriber: SubscriptionInsert
): Promise<Array<SubscriptionSelect>> => {
	return await db.insert(subscriptions).values(subscriber).returning();
};

export const getSubscriber = async ({
	stripeCustomerId,
	userId
}: {
	stripeCustomerId?: string;
	userId?: string;
}): Promise<Array<SubscriptionSelect>> => {
	if (userId) {
		return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
	} else if (stripeCustomerId) {
		return await db
			.select()
			.from(subscriptions)
			.where(eq(subscriptions.stripeCustomerId, stripeCustomerId));
	} else {
		throw new Error('Either stripeCustomerId or userId must be defined');
	}
};

export const updateSubscriber = async (
	stripeCustomerId: string,
	subscriber: SubscriptionInsert
): Promise<Array<SubscriptionSelect>> => {
	return await db
		.update(subscriptions)
		.set(subscriber)
		.where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
		.returning();
};

export const upsertSubscriber = async (
	subscriber: SubscriptionInsert
): Promise<Array<SubscriptionSelect>> => {
	return await db
		.insert(subscriptions)
		.values(subscriber)
		.onConflictDoUpdate({ set: subscriber, target: subscriptions.stripeCustomerId });
};

export const checkAndInsertNewSubscriber = async (
	subscriber: SubscriptionInsert
): Promise<Array<SubscriptionSelect>> => {
	const existingSubscriber = await getSubscriber({ stripeCustomerId: subscriber.stripeCustomerId });
	if (existingSubscriber.length === 0) {
		logger.info("Subscriber doesn't exist in db inserting");
		return await insertNewSubscriber(subscriber);
	} else {
		logger.info('Subscriber already exists');
	}
	return existingSubscriber;
};

import { pgTable, text, timestamp, boolean, uuid, numeric, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	did: text('did').notNull(),
	email: text('email'),
	handle: text('handle').notNull(),
	isSubscribed: boolean('is_subscribed').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const posts = pgTable('posts', {
	postId: uuid('id').defaultRandom().primaryKey().notNull(),
	postText: text('text').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: uuid('created_by')
		.notNull()
		.references(() => users.id, { onDelete: 'set null' }),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const subscriptions = pgTable('subscriptions', {
	userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // Foreign key to users table,
	stripeCustomerId: text('stripe_customer_id').notNull().unique().primaryKey(), // Stripe customer ID
	subscriptionId: text('subscription_id').notNull().unique(), // Stripe subscription ID
	subscriptionStatus: text('subscription_status').notNull().default('inactive'),
	subscriptionEndDate: integer('subscription_end_date'),
	subscriptionStartDate: integer('subscription_start_date'), // Subscription start date
	billingPeriodStartDate: integer('billing_period_start_date'),
	amount: numeric('amount'), // Subscription amount
	currency: text('currency'),
	canceledAt: integer('canceled_at'), // The time at which user canceled the subscription
	cancelAt: integer('cancel_at'), // The time at which the subscription should be canceled
	cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false), // Cancel at period end flag
	createdAt: timestamp('created_at').notNull().defaultNow(), // Created timestamp
	updatedAt: timestamp('updated_at').notNull().defaultNow() // Updated timestamp
});

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type PostSelect = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;
export type SubscriptionSelect = typeof subscriptions.$inferSelect;
export type SubscriptionInsert = typeof subscriptions.$inferInsert;

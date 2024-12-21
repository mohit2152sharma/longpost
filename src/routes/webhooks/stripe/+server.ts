import { json, error, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { checkEnvParam } from '$lib/server/db';
import { Logger } from '$lib/logger';
import { updateSubscriber, upsertSubscriber } from '$lib/server/db/utils';
import type { SubscriptionInsert } from '$lib/server/db/schema';

const logger = new Logger();
logger.info('Loading stripe secrets');
const STRIPE_SECRET_KEY = checkEnvParam('STRIPE_SECRET_KEY', true) as string;
const STRIPE_WEBHOOK_SECRET = checkEnvParam('STRIPE_WEBHOOK_SECRET', true) as string;

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async (event) => {
	let stripeEvent: Stripe.Event;
	// Step 1: Get the raw request body as a buffer
	const request = event.request;
	const payload = await request.text();
	const sig = request.headers.get('stripe-signature');
	try {
		// Step 2: Verify the webhook signature to ensure it's from Stripe
		if (!sig || !STRIPE_WEBHOOK_SECRET) {
			throw new Error('Missing Stripe signature or webhook secret');
		}

		stripeEvent = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);

		// Step 3: Handle the Stripe event
		switch (stripeEvent.type) {
			case 'customer.subscription.deleted': {
				logger.info(`stripeEvent type: ${stripeEvent.type}`);
				const subscription = stripeEvent.data.object as Stripe.Subscription;

				const subscriptionId = subscription.id;
				const stripeCustomerId = subscription.customer;
				const subscriptionStatus = subscription.status;

				logger.info(`Subscription deleted: ${subscriptionId}`);
				const subscriber: SubscriptionInsert = {
					stripeCustomerId: stripeCustomerId as string,
					subscriptionStatus: subscriptionStatus,
					subscriptionId: subscriptionId
				};
				try {
					await updateSubscriber(stripeCustomerId as string, subscriber);
				} catch (err) {
					logger.error(`Error updating subscriber: ${err}`);
					return error(502, `Error updating subscriber: ${err}`);
				}
				logger.info(`Subscription cancelled: ${subscriptionId} of customer: ${stripeCustomerId}`);
				break;
			}
			case 'customer.subscription.updated': {
				logger.info(`stripeEvent type: ${stripeEvent.type}`);
				const subscription = stripeEvent.data.object as Stripe.Subscription;

				const subscriber: SubscriptionInsert = {
					subscriptionId: subscription.id as string,
					stripeCustomerId: subscription.customer as string,
					subscriptionStatus: subscription.status,
					cancelAt: subscription.cancel_at,
					canceledAt: subscription.canceled_at,
					subscriptionEndDate: subscription.current_period_end,
					billingPeriodStartDate: subscription.current_period_start,
					subscriptionStartDate: subscription.start_date,
					cancelAtPeriodEnd: subscription.cancel_at_period_end,
					amount: subscription.items.data[0].plan.amount!.toString(),
					currency: subscription.items.data[0].plan.currency
				};
				try {
					await upsertSubscriber(subscriber);
				} catch (err) {
					logger.error(`Error updating subscriber: ${err}`);
					return error(502, `Error updating subscriber: ${err}`);
				}
				logger.info(
					`Subscription updated: ${subscription.id} of customer: ${subscription.customer}`
				);
				break;
			}
			case 'checkout.session.completed': {
				logger.info(`stripeEvent type: ${stripeEvent.type}`);
				const session = stripeEvent.data.object as Stripe.Checkout.Session;

				const stripeCustomerId = session.customer as string;
				const dbCustomerId = session.client_reference_id as string;
				const subscriptionId = session.subscription as string;
				logger.info(
					`Customer Id: ${stripeCustomerId}, subscription id: ${subscriptionId}, db customer id: ${dbCustomerId}`
				);
				const subscriber: SubscriptionInsert = {
					userId: dbCustomerId,
					stripeCustomerId: stripeCustomerId,
					subscriptionId: subscriptionId
				};
				try {
					await upsertSubscriber(subscriber);
				} catch (err) {
					logger.error(`Error inserting subscriber: ${err}`);
					return error(502, `Error inserting subscriber: ${err}`);
				}
				logger.info(`Checkout session completed: ${session.id}`);
				break;
			}
			default:
				logger.warn(`Unhandled stripeEvent type: ${stripeEvent.type}`);
		}

		// Step 4: Respond with success
		return json({ received: true }, { status: 200 });
	} catch (err) {
		logger.error(`Error verifying stripe webhook: ${err}`);
		return error(400, 'Webhook Error');
	}
};

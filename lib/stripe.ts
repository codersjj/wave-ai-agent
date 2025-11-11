import Stripe from "stripe";

// see: https://docs.stripe.com/billing/subscriptions/overview#subscription-statuses
// export type SUBSCRIPTION_STATUS = Stripe.Subscription.Status;
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  INCOMPLETE: "incomplete",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  PAST_DUE: "past_due",
  PAUSED: "paused",
  TRIALING: "trialing",
  UNPAID: "unpaid",
} as const;

export type SUBSCRIPTION_STATUS =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // see: https://docs.stripe.com/api/versioning
  apiVersion: "2025-10-29.clover", // Latest API version as of Stripe SDK v19
});

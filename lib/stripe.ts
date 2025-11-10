import Stripe from "stripe";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // see: https://docs.stripe.com/api/versioning
  apiVersion: "2025-10-29.clover", // Latest API version as of Stripe SDK v19
});

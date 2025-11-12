import { checkGenerationLimit } from "@/app/actions";
import { auth } from "@/lib/auth";
import { PLAN_ENUM } from "@/lib/constant";
import { getAuthUserMiddleware } from "@/lib/hono/middleware";
import prisma from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { SUBSCRIPTION_STATUS } from "@/lib/stripe";

const upgradeSchema = z.object({
  plan: z.enum([PLAN_ENUM.PLUS, PLAN_ENUM.PREMIUM]),
  callbackUrl: z.string().min(1),
});

export const subscriptionApp = new Hono()
  .post(
    "/upgrade",
    zValidator("json", upgradeSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const body = c.req.valid("json");

        const existingSubscription = await prisma.subscription.findFirst({
          where: {
            referenceId: user.id,
            status: SUBSCRIPTION_STATUS.ACTIVE,
          },
        });

        if (existingSubscription?.plan === body.plan) {
          throw new HTTPException(400, {
            message: `You are already on the ${body.plan} plan`,
          });
        }

        const data = await auth.api.upgradeSubscription({
          body: {
            plan: body.plan,
            successUrl: `${body.callbackUrl}?success=true`,
            cancelUrl: `${body.callbackUrl}?cancel=true`,
            disableRedirect: true,
            ...(existingSubscription?.status === SUBSCRIPTION_STATUS.ACTIVE &&
            existingSubscription.stripeSubscriptionId
              ? { subscriptionId: existingSubscription.stripeSubscriptionId }
              : {}),
          },
          headers: c.req.raw.headers,
        });

        return c.json({
          success: true,
          checkoutUrl: data.url,
        });
      } catch (error) {
        console.log("🚀 ~ error:", error);
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, {
          message: "Failed to create checkout session, please try again...",
        });
      }
    }
  )
  .get("/generations", getAuthUserMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const data = await checkGenerationLimit(user.id);

      return c.json({
        success: true,
        data,
      });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, {
        message: "Failed to retrieve generations data",
      });
    }
  });

import { generateText, UIMessage } from "ai";
import { myProvider, TITLE_MODEL } from "@/lib/ai/provider";
import prisma from "@/lib/prisma";
import { PLAN_ENUM, PLANS } from "@/lib/constant";
import { SUBSCRIPTION_STATUS } from "@/lib/stripe";
import { HTTPException } from "hono/http-exception";

export async function generateTitleForUserMessage(message: UIMessage) {
  console.log("🚀 ~ generateTitleForUserMessage ~ message:", message);
  try {
    const { text } = await generateText({
      model: myProvider.languageModel(TITLE_MODEL),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify(message),
    });

    return text;
  } catch (error) {
    console.log("Title generation failed", error);
    return "Untitled";
  }
}

export async function createDefaultSubscription(
  userId: string,
  stripeCustomerId: string
) {
  try {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        referenceId: userId,
      },
    });

    if (existingSubscription) {
      return {
        success: true,
        subscription: existingSubscription,
      };
    }

    const subscription = await prisma.subscription.create({
      data: {
        plan: PLAN_ENUM.FREE,
        referenceId: userId,
        stripeCustomerId,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      },
    });

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.log("🚀 ~ createDefaultSubscription ~ error:", error);
    return {
      success: false,
      error: "Failed to create subscription",
    };
  }
}

export async function checkGenerationLimit(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      status: SUBSCRIPTION_STATUS.ACTIVE,
    },
  });
  console.log("🚀 ~ checkGenerationLimit ~ subscription:", subscription);

  if (!subscription) {
    throw new HTTPException(400, { message: "No active subscription" });
  }

  const plan = PLANS.find((p) => p.name === subscription.plan);

  if (!plan) {
    throw new HTTPException(400, { message: "Invalid plan" });
  }

  const periodStart = subscription.periodStart ?? new Date(0);
  const periodEnd = subscription.periodEnd ?? new Date();

  const generationCount = await prisma.message.count({
    where: {
      chat: {
        userId,
      },
      role: "assistant",
      createdAt: {
        gte: periodStart,
        lte: periodEnd,
      },
    },
  });

  const isAllowed =
    plan.limits.generations === Infinity ||
    generationCount < plan.limits.generations;

  const maxLimit = Math.max(0, plan.limits.generations - generationCount);

  const hasPaidSubscription = !!subscription.stripeSubscriptionId;
  console.log(
    "🚀 ~ checkGenerationLimit ~ subscription.stripeSubscriptionId:",
    subscription.stripeSubscriptionId
  );
  console.log(
    "🚀 ~ checkGenerationLimit ~ hasPaidSubscription:",
    hasPaidSubscription
  );

  return {
    plan: subscription.plan,
    isAllowed,
    hasPaidSubscription,
    totalGenerationLimit:
      plan.limits.generations === Infinity
        ? "Unlimited"
        : plan.limits.generations,
    usedGeneration: generationCount,
    remainingGeneration:
      plan.limits.generations === Infinity ? "Unlimited" : maxLimit,
  };
}

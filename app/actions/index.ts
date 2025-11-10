import { generateText, UIMessage } from "ai";
import { myProvider, TITLE_MODEL } from "@/lib/ai/provider";
import prisma from "@/lib/prisma";
import { PLAN_ENUM } from "@/lib/constant";

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
        status: "active",
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

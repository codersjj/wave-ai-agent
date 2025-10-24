import { generateText, UIMessage } from "ai";
import { myProvider, TITLE_MODEL } from "@/lib/ai/provider";

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

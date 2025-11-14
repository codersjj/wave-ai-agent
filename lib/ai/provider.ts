import { customProvider, gateway } from "ai";
import { google } from "@ai-sdk/google";
import { chatModels, DEVELOPMENT_CHAT_MODEL } from "./models";

const NODE_ENV = process.env.NODE_ENV;
export const isProduction = NODE_ENV === "production";

export const TITLE_MODEL = "title-model";

const createLanguageModes = (isProduction: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models: Record<string, any> = chatModels.map((model) => ({
    // [model.id]: gateway.languageModel(model.id),
    [model.id]: google.languageModel(model.id),
  }));

  models[DEVELOPMENT_CHAT_MODEL] = google.languageModel(DEVELOPMENT_CHAT_MODEL);

  // models[TITLE_MODEL] = isProduction
  //   ? gateway.languageModel("google/gemini-2.5-flash")
  //   : google.languageModel(DEVELOPMENT_CHAT_MODEL);
  models[TITLE_MODEL] = isProduction
    ? google.languageModel(DEVELOPMENT_CHAT_MODEL)
    : google.languageModel(DEVELOPMENT_CHAT_MODEL);

  return models;
};

export const myProvider = customProvider({
  languageModels: createLanguageModes(isProduction),
});

import { tool } from "ai";
import z from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const webSearch = () =>
  tool({
    description:
      "Search the web for current information. Use when you need up-to-date info or when user asks to search the internet.",
    inputSchema: z.object({
      query: z.string().describe("Search web query"),
    }),
    execute: async ({ query }) => {
      try {
        const response = await tvly.search(query, {
          topic: "general",
          includeAnswer: true,
          includeFavicon: true,
          includeImages: false,
          maxResults: 3,
        });

        const results = response.results.map((r) => {
          const { title, url, content, favicon } = r;
          return {
            title,
            url,
            content,
            favicon,
          };
        });

        return {
          success: true,
          answer: response.answer || "No summary available",
          results,
          responseTime: response.responseTime,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          message: "Web search failed",
        };
      }
    },
  });

export default webSearch;

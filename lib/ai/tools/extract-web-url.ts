import { tool } from "ai";
import z from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const extractWebUrl = () =>
  tool({
    description:
      "Extract content from one or more URLs. Use this to retrieve, summarize, or analyze page content. Returns structured data per page including URL, title, content, and favicon.",
    inputSchema: z.object({
      urls: z.array(z.url().describe("Website url")),
    }),
    execute: async ({ urls }) => {
      try {
        const response = await tvly.extract(urls, {
          extractDepth: "basic",
          includeFavicon: true,
          includeImages: false,
          format: "markdown",
          topic: "general",
        });

        const results = response.results.map((r) => {
          const { url, rawContent, favicon } = r;
          return {
            url,
            content: rawContent || "No content extracted",
            favicon,
          };
        });

        return {
          success: true,
          urls,
          results,
          responseTime: response.responseTime,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          message: "Extract url content failed",
        };
      }
    },
  });

export default extractWebUrl;

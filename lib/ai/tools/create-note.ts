import prisma from "@/lib/prisma";
import { tool } from "ai";
import z from "zod";

const createNote = (userId: string) =>
  tool({
    description:
      "Create a note or save to note with title and content. Use this when the user asks to create, save, or make a note.",
    inputSchema: z.object({
      title: z.string().describe("The title of the note"),
      content: z.string().describe("The content/body of the note"),
    }),
    execute: async ({ title, content }) => {
      console.log("CREATE NOTE TOOL CALLED");
      try {
        const note = await prisma.note.create({
          data: {
            title,
            content,
            userId,
          },
        });

        return {
          success: true,
          data: note,
          message: `Note "${title}" created successfully with ID: ${note.id}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          message: "Failed to create note.",
        };
      }
    },
  });

export default createNote;

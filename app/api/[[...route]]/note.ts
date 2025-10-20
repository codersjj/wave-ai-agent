import { Hono } from "hono";
import z, { success } from "zod";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { getAuthUserMiddleware } from "@/lib/hono/middleware";
import prisma from "@/lib/prisma";

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

const noteIdSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
});

const updateNoteSchema = noteSchema.partial();

export const noteApp = new Hono()
  .post(
    "/create",
    zValidator("json", noteSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { title, content } = c.req.valid("json");
        const user = c.get("user");

        const note = await prisma.note.create({
          data: {
            title,
            content,
            userId: user.id,
          },
        });

        return c.json({
          success: true,
          data: note,
        });
      } catch (error) {
        throw new HTTPException(500, {
          message: "Failed to create note",
          cause: error,
        });
      }
    }
  )
  .patch(
    "/update/:id",
    zValidator("param", noteIdSchema),
    zValidator("json", updateNoteSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const { title, content } = c.req.valid("json");
        const user = c.get("user");

        const existingNote = await prisma.note.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!existingNote) {
          throw new HTTPException(404, { message: "Note not found" });
        }

        const updatedNote = await prisma.note.update({
          where: { id, userId: user.id },
          data: {
            title,
            content,
          },
        });

        return c.json({
          success: true,
          data: updatedNote,
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: "Failed to update note",
          cause: error,
        });
      }
    }
  )
  .delete(
    "/delete/:id",
    zValidator("param", noteIdSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const user = c.get("user");

        const existingNote = await prisma.note.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!existingNote) {
          throw new HTTPException(404, { message: "Note not found" });
        }

        await prisma.note.delete({
          where: {
            id,
            userId: user.id,
          },
        });

        return c.json({
          success: true,
          message: "Note deleted successfully",
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: "Failed to delete note",
          cause: error,
        });
      }
    }
  )
  .get("/all", getAuthUserMiddleware, async (c) => {
    try {
      const query = c.req.query();
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 20;

      const skip = (page - 1) * limit;

      const user = c.get("user");

      const [notes, total] = await Promise.all([
        prisma.note.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.note.count({
          where: {
            userId: user.id,
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return c.json({
        success: true,
        data: notes,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          skip,
        },
      });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: "Failed to get notes",
        cause: error,
      });
    }
  })
  .get(
    "/:id",
    zValidator("param", noteIdSchema),
    getAuthUserMiddleware,
    async (c) => {
      try {
        const { id } = c.req.valid('param')
        const user = c.get('user')
        const note = await prisma.note.findFirst({
          where: {
            id,
            userId: user.id
          }
        })

        if (!note) {
          throw new HTTPException(404, { message: "Note not found" });
        }

        return c.json({
          success: true,
          data: note
        })
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        throw new HTTPException(500, {
          message: "Failed to get note",
          cause: error,
        });
      }
    }
  );

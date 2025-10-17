import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { noteApp } from "./note";
import { getAuthUserMiddleware } from "@/lib/hono/middleware";

export const runtime = "nodejs";

const app = new Hono().basePath("/api").route("/note", noteApp);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({
    error: "internal server error",
  });
});

app.get("/", getAuthUserMiddleware, (c) => {
  return c.json({
    message: "Hello from Wave AI",
  });
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const page = c.req.query("page");
  return c.json({
    message: "Hello from Wave AI",
    id,
    page,
  });
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

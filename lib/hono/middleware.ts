import { createMiddleware } from "hono/factory";
import { auth } from "../auth";
import { HTTPException } from "hono/http-exception";

type Env = {
  Variables: {
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

export const getAuthUserMiddleware = createMiddleware<Env>(async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    c.set("user", session.user);
    await next();
  } catch (error) {
    console.log(error);
    throw new HTTPException(401, { message: "Unauthorized" });
  }
});

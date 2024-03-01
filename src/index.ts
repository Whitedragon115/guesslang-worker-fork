import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { DetectionOptions, detectLanguages } from "./language-detection";

// See https://hono.dev/getting-started/cloudflare-workers
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/guesslang", async (c) => {
  const query = c.req.query();
  const { text, ...options } = query;
  if (!text) {
    throw new HTTPException(400, {
      message: `Missing query parameter 'text'`,
    });
  }
  const guessResult = await detectLanguages(text, options);
  return c.json(guessResult);
});

app.post("/guesslang", async (c) => {
  const body = await c.req.json<
    Partial<DetectionOptions> & { text?: string }
  >();
  const { text, ...options } = body;
  if (!text) {
    throw new HTTPException(400, {
      message: `Missing query parameter 'text'`,
    });
  }
  const guessResult = await detectLanguages(text, options);
  return c.json(guessResult);
});

export default app;

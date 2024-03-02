import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { Fragment } from "hono/jsx";
import { Layout } from "./client/layout";
import { detectLanguages } from "./language-detection";
import { DetectionOptions } from "./types";

// See https://hono.dev/getting-started/cloudflare-workers
const app = new Hono();

app.use("/guess", cors());

app.get(
  "/static/*",
  serveStatic({
    root: "./",
    manifest: manifestJSON,
    rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
  }),
);

app.get("/", (c) => {
  return c.html(Fragment({ children: Layout({}) }));
});

app.get("/guess", async (c) => {
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

app.post("/guess", async (c) => {
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

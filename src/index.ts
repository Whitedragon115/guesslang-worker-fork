import { Hono } from "hono";

// See https://hono.dev/getting-started/cloudflare-workers
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;

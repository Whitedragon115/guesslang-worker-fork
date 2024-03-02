import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    if (!worker) {
      return;
    }
    await worker.stop();
  });

  it("should return 200 response", async () => {
    const resp = await worker.fetch("/");
    expect(resp.status).toBe(200);
  });

  it("should get guesslang works", async () => {
    const resp = await worker.fetch("/guess?text=console.log");
    expect(resp.status).toBe(200);
    expect(await resp.json()).toMatchObject({
      confidence: 0.08425559401512146,
      reliable: false,
      languageId: "css",
      languageName: "CSS",
    });
  });

  it("should post guesslang works", async () => {
    const resp = await worker.fetch("/guess", {
      method: "POST",
      body: JSON.stringify({ text: 'import { Hono } from "hono";' }),
    });
    expect(resp.status).toBe(200);
    expect(resp.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(await resp.json()).toMatchObject({
      confidence: 0.09199294000864029,
      reliable: false,
      languageId: "ts",
      languageName: "TypeScript",
    });
  });
});

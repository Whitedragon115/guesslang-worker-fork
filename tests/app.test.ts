import { describe, expect, it } from "vitest";
import app from "../src";
import { DetectionResult } from "../src/types";

describe("Test the application", () => {
  it("Should return 200 response", async () => {
    const res = await app.request("http://localhost/");
    expect(res.status).toBe(200);
  });

  it("Should return 400 response", async () => {
    const res = await app.request("http://localhost/guess");
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Missing query parameter 'text'");
  });

  it("should get guesslang works", async () => {
    const resp = await app.request("/guess?text=console.log");
    expect(resp.status).toBe(200);
    expect(await resp.json()).toMatchObject({
      confidence: 0.08425559401512146,
      reliable: false,
      languageId: "css",
      languageName: "CSS",
    });
  });

  it("should post guesslang works", async () => {
    const resp = await app.request("/guess", {
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

  it("should get expectedRelativeConfidence guesslang works", async () => {
    const resp = await app.request(
      "/guess?text=import&expectedRelativeConfidence=0",
    );
    expect(resp.status).toBe(200);
    const json = await resp.json<DetectionResult>();
    expect(json.confidence).toMatchObject(0.0883780375123024);
    expect(json.reliable).toMatchObject(true);
  });

  it("should post expectedRelativeConfidence guesslang works", async () => {
    const resp = await app.request("/guess", {
      method: "POST",
      body: JSON.stringify({
        text: "import",
        expectedRelativeConfidence: 0,
      }),
    });
    expect(resp.status).toBe(200);
    const json = await resp.json<DetectionResult>();
    expect(json.confidence).toMatchObject(0.0883780375123024);
    expect(json.reliable).toMatchObject(true);
  });
});

import app from "../src";
import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

// describe("Worker", () => {
//   let worker: UnstableDevWorker;

//   beforeAll(async () => {
//     worker = await unstable_dev("src/index.ts", {
//       experimental: { disableExperimentalWarning: true },
//     });
//   });

//   afterAll(async () => {
//     await worker.stop();
//   });

//   it("should return 200 response", async () => {
//     const resp = await worker.fetch("/");
//     expect(resp.status).toBe(200);
//   });
// });

describe("Test the application", () => {
  it("Should return 200 response", async () => {
    const res = await app.request("http://localhost/");
    expect(res.status).toBe(200);
  });

  it("Should return 400 response", async () => {
    const res = await app.request("http://localhost/guesslang");
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Missing query parameter 'text'");
  });

  it("Should guesslang", async () => {
    const res = await app.request(
      "http://localhost/guesslang?text=console.log",
    );
    expect(res.status).toBe(200);
  });
});

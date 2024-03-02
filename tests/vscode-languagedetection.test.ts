import { describe, expect, it } from "vitest";
import util from "node:util";
import child_process from "child_process";

describe("vscode-languagedetection", () => {
  it("should match baseline", async () => {
    const exec = util.promisify(child_process.exec);
    try {
      const result = await exec(
        "diff node_modules/@vscode/vscode-languagedetection/lib/index.ts src/vscode-languagedetection/index.ts",
      );
      expect(result.stdout).toBe("");
    } catch (e) {
      expect.unreachable();
    }
  });
});

import { describe, expect, it } from "vitest";
import util from "node:util";
import child_process from "child_process";

describe("vscode-languagedetection", () => {
  it("should match baseline", async () => {
    const exec = util.promisify(child_process.exec);
    const result = await exec(
      "diff --ignore-all-space node_modules/@vscode/vscode-languagedetection/lib/index.ts src/vscode-languagedetection/index.ts || true",
    );
    expect(result.stdout).toMatchFileSnapshot(
      "__snapshots__/vscode-languagedetection.diff",
    );
  });
});

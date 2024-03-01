import { detectLanguages, guessLang } from "../src/language-detection";
import { describe, expect, it } from "vitest";

describe("guessLang", () => {
  it("should match snapshot for the given code snippet", async () => {
    // Example from https://github.com/microsoft/vscode-languagedetection
    const result = await guessLang(
      `
  function makeThing(): Thing {
      let size = 0;
      return {
          get size(): number {
          return size;
          },
          set size(value: string | number | boolean) {
          let num = Number(value);
          // Don't allow NaN and stuff.
          if (!Number.isFinite(num)) {
              size = 0;
              return;
          }
          size = num;
          },
      };
  }
`,
      false,
    );
    expect(result).toMatchSnapshot();
  });

  it("should match snapshot for the given code snippet", async () => {
    // Example from https://github.com/microsoft/vscode-languagedetection
    const result = await guessLang(
      `
  function makeThing(): Thing {
      let size = 0;
      return {
          get size(): number {
          return size;
          },
          set size(value: string | number | boolean) {
          let num = Number(value);
          // Don't allow NaN and stuff.
          if (!Number.isFinite(num)) {
              size = 0;
              return;
          }
          size = num;
          },
      };
  }
`,
      true,
    );
    expect(result).toMatchSnapshot();
  });
});

describe("detectLanguages", () => {
  it("should return the correct language for the given code snippet", async () => {
    // Example from https://github.com/microsoft/vscode-languagedetection
    const result = await detectLanguages(`
  function makeThing(): Thing {
      let size = 0;
      return {
          get size(): number {
          return size;
          },
          set size(value: string | number | boolean) {
          let num = Number(value);
          // Don't allow NaN and stuff.
          if (!Number.isFinite(num)) {
              size = 0;
              return;
          }
          size = num;
          },
      };
  }
`);
    expect(result).toMatchObject({
      confidence: 0.41006417870521544,
      isCreditable: true,
      languageId: "ts",
      languageName: "TypeScript",
    });
  });

  it("should return fallback txt for empty input", async () => {
    // Example from https://github.com/microsoft/vscode-languagedetection
    const result = await detectLanguages(``);
    expect(result).toMatchObject({
      confidence: 0,
      isCreditable: false,
      languageId: "txt",
      languageName: "Plain Text",
    });
  });
});

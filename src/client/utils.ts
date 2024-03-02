import { DetectionResult, DetectionOptions } from "../types";

export const DEFAULT_TEXT = `
export type DetectionOptions = {
  fineTune: boolean;
  verbose: boolean;
  expectedRelativeConfidence: number;
};

export const guessLanguage = async (
  text: string,
  options: Partial<DetectionOptions> = {},
) => {
  const resp = await fetch("https://guesslang.waterwater.moe/guess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text.slice(0, 1000),
      ...options,
    }),
  });
  if (!resp.ok) {
    return null;
  }
  const data = await resp.json<DetectionResult>();
  return data;
};
`.trimStart();

export const DEFAULT_RESULT: DetectionResult = {
  languageId: "txt",
  languageName: "Plain Text",
  confidence: 0,
  reliable: false,
};

export const FALLBACK: DetectionResult = {
  languageId: "txt",
  languageName: "???",
  confidence: 0.0,
  reliable: false,
};

export const guessLanguage = async (
  text: string,
  options: Partial<DetectionOptions> = {},
) => {
  const resp = await fetch("https://guesslang.waterwater.moe/guess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text.slice(0, 1000),
      ...options,
    }),
  });
  if (!resp.ok) {
    return null;
  }
  const data = await resp.json<DetectionResult>();
  return data;
};

export const sample = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const getEmoji = (confidence: number) => {
  if (confidence === 0) {
    return "";
  }
  if (confidence < 0) {
    return "🤔";
  }
  if (confidence < 0.05) {
    return "😭";
  }
  if (confidence < 0.1) {
    return sample(["😨", "😵", "😖", "😫", "😩", "🥺", "😢"]);
  }
  if (confidence < 0.2) {
    return sample(["😞", "😞", "😔", "😟", "😕", "🙁", "😣"]);
  }
  if (confidence < 0.3) {
    return "🙂";
  }
  if (confidence < 0.4) {
    return "😊";
  }
  if (confidence < 0.5) {
    return sample(["😄", "🤠", "😋"]);
  }
  return sample(["🤩", "🥳", "😏", "😎", "😝"]);
};

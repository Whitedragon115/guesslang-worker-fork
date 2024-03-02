import { DetectionResult, DetectionOptions } from "../types";

export const DEFAULT_TEXT = `
enum LogLevel {
  ERROR,
  WARN,
  INF
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
`.trimStart();

export const DEFAULT_RESULT: DetectionResult = {
  languageId: "ts",
  languageName: "TypeScript",
  confidence: 0.312,
  reliable: true,
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
  if (confidence < 0.05) {
    return "😭";
  }
  if (confidence < 0.1) {
    return "😢";
  }
  if (confidence < 0.15) {
    return "😞";
  }
  if (confidence < 0.2) {
    return "😐";
  }
  if (confidence < 0.3) {
    return "🙂";
  }
  if (confidence < 0.4) {
    return "😊";
  }
  return sample(["😄", "🤩", "🥳", "😏", "😎"]);
};

import { ModelResult } from "@vscode/vscode-languagedetection";

export type DetectionOptions = {
  fineTune: boolean;
  verbose: boolean;
  expectedRelativeConfidence: number;
};

export type DetectionResult = {
  languageId: string;
  languageName: string;
  confidence: number;
  reliable: boolean;
  /**
   * Only available when `verbose` is `true`.
   */
  modelResults?: ModelResult[];
};

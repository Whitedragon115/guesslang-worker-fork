import { ModelResult } from "./vscode-languagedetection/index";

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
  verbose?: ModelResult[];
};

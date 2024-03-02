import NODE_WEIGHTS from "@vscode/vscode-languagedetection/model/group1-shard1of1.bin";
import NODE_MODEL_JSON from "@vscode/vscode-languagedetection/model/model.json";
import languagesMap from "./languages.json";
import { DetectionOptions, DetectionResult } from "./types";
import { ModelOperations, ModelResult } from "./vscode-languagedetection/index";

/*---------------------------------------------------------------------------------------------
 *  Ported from https://github.com/microsoft/vscode/blob/19ecb4b8337d0871f0a204853003a609d716b04e/src/vs/workbench/services/languageDetection/browser/languageDetectionSimpleWorker.ts
 *
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const expectedRelativeConfidence = 0.2;
const positiveConfidenceCorrectionBucket1 = 0.05;
const positiveConfidenceCorrectionBucket2 = 0.025;
const negativeConfidenceCorrection = 0.5;

const adjustLanguageConfidence = (modelResult: ModelResult): ModelResult => {
  switch (modelResult.languageId) {
    // For the following languages, we increase the confidence because
    // these are commonly used languages in VS Code and supported
    // by the model.
    case "js":
    case "html":
    case "json":
    case "ts":
    case "css":
    case "py":
    case "xml":
    case "php":
      modelResult.confidence += positiveConfidenceCorrectionBucket1;
      break;
    // case 'yaml': // YAML has been know to cause incorrect language detection because the language is pretty simple. We don't want to increase the confidence for this.
    case "cpp":
    case "sh":
    case "java":
    case "cs":
    case "c":
      modelResult.confidence += positiveConfidenceCorrectionBucket2;
      break;

    // For the following languages, we need to be extra confident that the language is correct because
    // we've had issues like #131912 that caused incorrect guesses. To enforce this, we subtract the
    // negativeConfidenceCorrection from the confidence.

    // languages that are provided by default in VS Code
    case "bat":
    case "ini":
    case "makefile":
    case "sql":
    // languages that aren't provided by default in VS Code
    case "csv":
    case "toml":
      // Other considerations for negativeConfidenceCorrection that
      // aren't built in but suported by the model include:
      // * Assembly, TeX - These languages didn't have clear language modes in the community
      // * Markdown, Dockerfile - These languages are simple but they embed other languages
      modelResult.confidence -= negativeConfidenceCorrection;
      break;

    default:
      break;
  }
  return modelResult;
};

// See https://github.com/microsoft/vscode-languagedetection#advanced-options
const modelOperations = new ModelOperations({
  minContentSize: 0,
  modelJsonLoaderFunc: async () => {
    // return await import("@vscode/vscode-languagedetection/model/model.json");
    return NODE_MODEL_JSON;
  },
  weightsLoaderFunc: async () => {
    return NODE_WEIGHTS;
  },
});

const FALLBACK_LANGUAGE = {
  languageId: "txt",
  languageName: "Plain Text",
  confidence: 0,
  reliable: false,
} as const;

const DEFAULT_DETECTION_OPTIONS: DetectionOptions = {
  fineTune: true,
  verbose: false,
  expectedRelativeConfidence: expectedRelativeConfidence,
};

export const guessLang = async (text: string, fineTune: boolean) => {
  const modelResults = await modelOperations.runModel(text);
  const fineTunedModelResults = fineTune
    ? modelResults
        .map((modelResult) => adjustLanguageConfidence(modelResult))
        .sort((a, b) => b.confidence - a.confidence)
    : modelResults;
  return fineTunedModelResults;
};

export const detectLanguages = async (
  sampleContent: string,
  maybeOptions: Partial<DetectionOptions> = DEFAULT_DETECTION_OPTIONS,
): Promise<DetectionResult> => {
  const options = { ...DEFAULT_DETECTION_OPTIONS, ...maybeOptions };
  const modelResults = await guessLang(sampleContent, options.fineTune);
  const firstModelResult = modelResults.at(0);
  if (!firstModelResult) {
    return {
      ...FALLBACK_LANGUAGE,
      ...(options.verbose ? { modelResults: modelResults } : {}),
    };
  }

  return {
    languageId: firstModelResult.languageId,
    languageName:
      languagesMap[firstModelResult.languageId as keyof typeof languagesMap],
    confidence: firstModelResult.confidence,
    reliable: firstModelResult.confidence >= options.expectedRelativeConfidence,
    ...(options.verbose ? { modelResults: modelResults } : {}),
  };
};

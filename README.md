# 🎲 Guesslang Worker

[![Build](https://github.com/lawvs/guesslang-worker/actions/workflows/build.yml/badge.svg)](https://github.com/lawvs/guesslang-worker/actions/workflows/build.yml)

🤖 A worker that uses guesslang's ML model to detect source code languages

Powered by [vscode-languagedetection](https://github.com/microsoft/vscode-languagedetection)!

## Usage

You can access the worker at <https://guesslang.waterwater.moe/guess?text=YOUR_CODE>E>

Alternatively, you can utilize the POST method to send a JSON object containing the `text` key.

```ts
const resp = await fetch("https://guesslang.waterwater.moe/guess", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "const root = ReactDOM.createRoot",
    // verbose: false, // Show more information about the detection. default: false
  }),
});
const data = await resp.json();
console.log(data);
// { languageId: 'js', languageName: 'JavaScript', confidence: 0.07452436648309231, reliable: false }
```

```sh
curl 'https://guesslang.waterwater.moe/guess' \
  -H 'content-type: application/json' \
  --data-raw '{ "text": "const root = ReactDOM.createRoot", "verbose": false }'
```

## Development

```sh
pnpm install
pnpm run dev
```

To run the tests, simply run `pnpm test`.

To deploy this worker, run `pnpm run deploy`

## API

### TypeScript Definitions

```ts
export type DetectionOptions = {
  /**
   * Fine-tune the model results.
   *
   * Enabling this flag will increase the confidence of certain languages commonly used in VS Code and supported by the model.
   *
   * @default true
   */
  fineTune: boolean;
  /**
   * Show `modelResults` information in the response.
   *
   * @default false
   */
  verbose: boolean;
  /**
   * The expected relative confidence to consider a detection reliable.
   *
   * @default 0.2
   */
  expectedRelativeConfidence: number;
};

export type DetectionResult = {
  languageId: string;
  languageName: string;
  /**
   * The relative confidence of the detection.
   */
  confidence: number;
  /**
   * Whether the detection is reliable.
   *
   * It will be `false` if the confidence is lower than `expectedRelativeConfidence`.
   */
  reliable: boolean;
  /**
   * Only available when `verbose` is `true`.
   */
  modelResults?: ModelResult[];
};

export interface ModelResult {
  languageId: string;
  confidence: number;
}
```

### `GET /guess`

#### Query Parameters

- `text` (required): The source code to detect the language of
- `verbose` (optional): Show more information about the detection. default: false
- `fineTune` (optional): Finetune the detection. default: false
- `expectedRelativeConfidence` (optional): The expected relative confidence to consider a detection reliable. default: 0.2

### `POST /guess`

#### Request Body

```json
{
  "text": "YOUR_CODE",
  "verbose": false,
  "fineTune": false,
  "expectedRelativeConfidence": 0.2
}
```

#### Example Response

```json
{
  "languageId": "js",
  "languageName": "JavaScript",
  "confidence": 0.1,
  "reliable": false
}
```

## Credits

- [guesslang](https://github.com/yoeo/guesslang)
- [vscode-languagedetection](https://github.com/microsoft/vscode-languagedetection)

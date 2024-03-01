# Guesslang Worker

[![Test](https://github.com/lawvs/guesslang-worker/actions/workflows/build.yml/badge.svg)](https://github.com/lawvs/guesslang-worker/actions/workflows/build.yml)

A worker that uses guesslang's ML model to detect source code languages

Powered by [vscode-languagedetection](https://github.com/microsoft/vscode-languagedetection)!

## Usage

You can access the worker at https://guesslang.waterwater.moe/guess?text=YOUR_CODE

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

## Credits

- [guesslang](https://github.com/yoeo/guesslang)
- [vscode-languagedetection](https://github.com/microsoft/vscode-languagedetection)

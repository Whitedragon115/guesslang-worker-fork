import { useState } from "hono/jsx";
import {
  buttonClass,
  globalClass,
  playgroundClass,
  playgroundHeaderClass,
  titleClass,
} from "./styles";
import { DetectionResult } from "../types";
import { css } from "hono/css";
import { Loading } from "./loading";
import {
  getEmoji,
  DEFAULT_TEXT,
  DEFAULT_RESULT,
  guessLanguage,
  FALLBACK,
} from "./utils";

const Header = ({
  loading,
  result,
}: {
  loading: boolean;
  result: DetectionResult;
}) => {
  const { languageName, confidence } = result;
  const percent = (confidence * 100).toFixed(1);

  return (
    <div class={playgroundHeaderClass}>
      {loading && <Loading />}
      {!loading && (
        <>
          <div>{languageName}</div>
          <div title="Confidence">
            {percent}% {getEmoji(confidence)}
          </div>
        </>
      )}
      <div
        class={css`
          margin-left: auto;
          opacity: 0.5;
          font-size: 0.75rem;
          line-height: 1rem;
        `}
      >
        Playground
      </div>
    </div>
  );
};

const Playground = () => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [guessResult, setGuessResult] =
    useState<DetectionResult>(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!text || loading) {
      return;
    }
    setLoading(true);
    try {
      const result = await guessLanguage(text, { verbose: true });
      if (!result) {
        setGuessResult(FALLBACK);
        return;
      }
      setGuessResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class={playgroundClass}>
      <Header loading={loading} result={guessResult} />
      <div
        class={css`
          position: relative;
          flex: 1;
        `}
      >
        <span dangerouslySetInnerHTML={{ __html: "" }} />
        <textarea
          class={css`
            position: absolute;
            caret-color: rgb(156 163 175);
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          `}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          value={text}
          onInput={(event) => {
            if (!event.target) {
              throw new Error("No event target found");
            }
            setText((event.target as HTMLTextAreaElement).value ?? "");
          }}
        />
      </div>
      <button class={buttonClass} onClick={onClick}>
        Guess
      </button>
    </div>
  );
};

export const Home = () => (
  <div class={globalClass}>
    <h1 class={titleClass}>Guess Language Online!</h1>
    <Playground />
  </div>
);

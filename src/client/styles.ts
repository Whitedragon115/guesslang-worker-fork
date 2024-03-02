import { css } from "hono/css";

export const globalClass = css`
  :-hono-global {
    html {
      font-family: Arial, Helvetica, sans-serif;
    }

    #root {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const titleClass = css`
  line-height: 64px;
  font-size: 48px;
  max-width: 576px;
  color: rgba(60, 60, 67);
`;

export const playgroundClass = css`
  min-height: 25rem;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    Courier New,
    monospace;
  display: flex;
  flex-direction: column;
  line-height: 1.7;
  font-size: 1rem;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 24px;
  padding-right: 24px;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);

  & > * + * {
    margin-top: 1rem;
  }
`;

export const buttonClass = css`
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  cursor: pointer;

  border-color: transparent;
  color: rgba(60, 60, 67);
  background-color: #ebebef;

  &:hover {
    color: rgba(60, 60, 67);
    background-color: #e4e4e9;
  }

  &:active {
    color: rgba(60, 60, 67);
    background-color: #dddde3;
  }
`;

export const playgroundHeaderClass = css`
  display: flex;
  align-items: center;

  & > * {
  }

  & > * + * {
    margin-left: 1rem;
  }
`;

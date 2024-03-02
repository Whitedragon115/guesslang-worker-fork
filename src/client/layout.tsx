import { Style } from "hono/css";
import { PropsWithChildren } from "hono/jsx";

const siteData = {
  title: "Guess Language Online!",
  description: "Uses ML model to detect source code languages",
  script: "/static/main.js",
};

export const Layout = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <title>{siteData.title}</title>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={siteData.description} />
      <link
        rel="shortcut icon"
        href="https://guesslang.readthedocs.io/en/latest/_static/favicon.png"
      ></link>
      <Style />
    </head>
    <body>
      <div id="root">{children}</div>
    </body>
    {siteData.script && <script type="module" src={siteData.script}></script>}
  </html>
);

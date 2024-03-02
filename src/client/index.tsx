import { render } from "hono/jsx/dom";
import { Home } from "./home";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

render(<Home />, root);

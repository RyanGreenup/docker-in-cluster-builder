import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

const query = window.matchMedia("(prefers-color-scheme: dark)");

addons.setConfig({ theme: query.matches ? themes.dark : themes.light });

query.addEventListener("change", (e) => {
  addons.setConfig({ theme: e.matches ? themes.dark : themes.light });
});

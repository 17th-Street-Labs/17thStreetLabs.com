import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default tseslint.config(
  { ignores: ["dist/**", ".astro/**", "node_modules/**", ".sites-runtime/**", ".wrangler/**", ".vercel/**", "outputs/**", "work/**", "playwright-report/**", "test-results/**", ".remember/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ["**/*.{js,mjs,ts}"],
    languageOptions: { globals: { console: "readonly", process: "readonly", URL: "readonly", document: "readonly", window: "readonly", HTMLElement: "readonly", HTMLDialogElement: "readonly", HTMLFormElement: "readonly", HTMLButtonElement: "readonly", FormData: "readonly", matchMedia: "readonly", requestAnimationFrame: "readonly" } },
  },
);

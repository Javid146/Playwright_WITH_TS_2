/*
 * ESLint configuration (eslint.config.mjs) - OPTIONAL
 *
 * ESLint checks JavaScript, TypeScript, and JSON files
 * for potential coding mistakes and code-quality issues.
 *
 * Difference:
 * - tsconfig.json: Configures TypeScript compilation and type checking.
 * - eslint.config.mjs: Configures linting and code-quality rules.
 *
 * Both files are optional for running Playwright tests.
 * They can be used together in the same project.
 */

import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([

  /*
   * Apply browser global variable settings to JS and TS files.
   * ** means search all directories and subdirectories.
   * The extensions include js, mjs, cjs, ts, mts, and cts.
   * globals.browser recognizes variables such as window and document.
   */
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser }
  },

  /*
   * Enable recommended TypeScript ESLint rules.
   * Helps detect unused variables and potential coding mistakes.
   */
  tseslint.configs.recommended,

  /*
   * Enable JSON file linting.
   * **/*.json means JSON files in all directories.
   * plugins: { json } registers the JSON ESLint plugin.
   * language: "json/json" tells ESLint to parse JSON files.
   */
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json"
  }

]);
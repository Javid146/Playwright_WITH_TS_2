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
 * They can be used together in the same project.
 * Note:
 * - VS Code's built-in TypeScript support already detects and underlines
 *   many TypeScript errors while you write code.
 * - The ESLint VS Code extension can also underline linting issues
 *   when ESLint is installed and configured.
 * - Playwright can run TypeScript tests without a separate
 *   "npx tsc --noEmit" check, but it does not perform full TypeScript
 *   type checking by default.
 * - Therefore, running separate ESLint and TypeScript checks is optional
 *   for running Playwright tests, but useful for catching issues before
 *   committing code or running tests in CI/CD.
 */

import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([

/*
 * Apply this ESLint configuration to all JavaScript and TypeScript files.
 *
 * files: ["** /*.{js,mjs,cjs,ts,mts,cts}"]
 * -** /* means search the current project and all its subfolders.
 * - The extensions specify which file types ESLint should match:
 *   .js, .mjs, .cjs, .ts, .mts, and .cts.
 *
 * languageOptions: { globals: globals.browser }
 * - Tells ESLint that standard browser variables, such as window,
 *   document, and localStorage, already exist.
 * - Prevents ESLint from reporting these variables as undefined.
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
   * Enable JSON file linting and code quality rules.
   Linting means automatically checking your code for potential mistakes, unused variables, 
   bad coding practices, and coding-style violations.
   * ** /*.json means JSON files in all directories.
   * plugins: { json } registers the JSON ESLint plugin.
   * language: "json/json" tells ESLint to parse JSON files.
   */
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json"
  }

]);
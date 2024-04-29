/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["standard", "@repo/eslint-config/server.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    ecmaVersion: "2024",
    sourceType: "module",
  },
};

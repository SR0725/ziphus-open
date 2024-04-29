/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "standard",
    "@repo/eslint-config/next.js",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@nextui-org/react",
            message: "Please import from '@/components/nextui' instead.",
          },
          {
            name: "clsx",
            importNames: ["default", "clsx"],
            message: "Please import from '@/utils/cn' instead.",
          },
        ],
      },
    ],
    "no-useless-constructor": "off",
  },
  overrides: [
    {
      files: ["./src/utils/cn.ts"], // Allow `clsx` import in `cn.ts`
      rules: {
        "no-restricted-imports": ["off"],
      },
    },
  ],
};

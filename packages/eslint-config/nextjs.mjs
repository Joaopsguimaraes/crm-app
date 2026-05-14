import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import { createBaseConfig } from "./base.mjs";

export function createNextConfig(options = {}) {
  return [
    ...createBaseConfig(options),
    {
      files: ["**/*.{ts,tsx}"],
      plugins: {
        "@next/next": nextPlugin,
        "react-hooks": reactHooks
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs["core-web-vitals"].rules,
        ...reactHooks.configs.recommended.rules,
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ];
}

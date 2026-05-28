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
        "@typescript-eslint/explicit-function-return-type": "off",
        "no-restricted-properties": [
          "error",
          {
            object: "Date",
            property: "now",
            message:
              "Avoid Date.now() in React render paths because it can create SSR hydration mismatches. Use a server-provided value, a deterministic helper, or run time-dependent code in an effect/event handler."
          },
          {
            object: "Math",
            property: "random",
            message:
              "Avoid Math.random() in React render paths because it can create SSR hydration mismatches. Use deterministic values or run randomness in an effect/event handler."
          }
        ]
      }
    }
  ];
}

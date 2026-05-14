import { createBaseConfig } from "./base.mjs";

export function createNestConfig(options = {}) {
  return [
    ...createBaseConfig(options),
    {
      files: ["**/*.ts"],
      languageOptions: {
        globals: {
          Buffer: "readonly",
          console: "readonly",
          module: "readonly",
          process: "readonly",
          require: "readonly"
        }
      },
      rules: {
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/no-unsafe-declaration-merging": "error"
      }
    }
  ];
}

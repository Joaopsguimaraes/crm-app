import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createBaseConfig } from "@crm/eslint-config/base";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ["*.config.mjs"],
  },
  ...createBaseConfig({ tsconfigRootDir }),
];

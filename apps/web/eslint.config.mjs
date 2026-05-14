import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createNextConfig } from "@crm/eslint-config/nextjs";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default createNextConfig({ tsconfigRootDir });

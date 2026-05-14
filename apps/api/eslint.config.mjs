import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createNestConfig } from "@crm/eslint-config/nestjs";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default createNestConfig({ tsconfigRootDir });

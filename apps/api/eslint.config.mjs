import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createNestConfig } from "@crm/eslint-config/nestjs";

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

const oneExportPerFileRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce one exported symbol per source file"
    },
    messages: {
      oneExportPerFile: "Use only one exported symbol per file. Split DTOs, enums, responses, and providers by SRP."
    },
    schema: []
  },
  create(context) {
    let exportCount = 0;

    return {
      ExportAllDeclaration() {
        exportCount += 1;
      },
      ExportDefaultDeclaration() {
        exportCount += 1;
      },
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          exportCount += 1;
          return;
        }

        exportCount += node.specifiers.length;
      },
      "Program:exit"(node) {
        if (exportCount > 1) {
          context.report({ node, messageId: "oneExportPerFile" });
        }
      }
    };
  }
};

export default [
  { ignores: ["*.cjs", "*.mjs"] },
  ...createNestConfig({ tsconfigRootDir }),
  {
    files: ["src/**/*.ts"],
    plugins: {
      "api-boundaries": {
        rules: {
          "one-export-per-file": oneExportPerFileRule
        }
      }
    },
    rules: {
      "api-boundaries/one-export-per-file": "error"
    }
  },
  {
    files: ["src/**/*.spec.ts", "test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": "off"
    }
  }
];

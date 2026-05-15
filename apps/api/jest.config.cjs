/** @type {import("jest").Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@crm/shared$": "<rootDir>/../../packages/shared/src/index.ts"
  },
  rootDir: ".",
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts", "**/*.integration-spec.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }]
  }
};

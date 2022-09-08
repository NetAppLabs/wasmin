export default /** @type {import("@jest/types").Config} */ ({
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
      // diagnostics: false
    },
  },
  testMatch: ["**/*.test.ts"],
  //modulePathIgnorePatterns: ["../packages/fs-js"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  setupFilesAfterEnv: ["./tests/setup.ts", "jest-extended"]
})

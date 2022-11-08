export default /** @type {import("@jest/types").Config} */ ({
  preset: "ts-jest/presets/default-esm",
  testMatch: ["**/*.test.ts"],
  //modulePathIgnorePatterns: ["../packages/fs-js"],
  transform: {
    "^.+\\.ts$": [ "ts-jest", {
      useESM: true,
    }]
  },
  setupFilesAfterEnv: ["./tests/setup.ts", "jest-extended"]
})

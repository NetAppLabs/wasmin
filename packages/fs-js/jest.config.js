export default /** @type {import("@jest/types").Config.InitialOptions} */ ({
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testMatch: ["/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
})

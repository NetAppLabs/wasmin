export default /** @type {import("@jest/types").Config.InitialOptions} */ ({
  preset: "ts-jest/presets/default-esm",
  testMatch: ["/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [ "ts-jest", {
      useESM: true,
    }]
  },
})

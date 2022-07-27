module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        "default": [
          "public-constructor",
          "protected-constructor",
          "private-constructor",
          "constructor",
          "static-field",
          "public-static-field",
          "private-static-field",
          "protected-static-field",
          "public-static-method",
          "private-static-method",
          "protected-static-method",
          "static-method",
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "instance-field",
          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",
          "instance-method"
        ]
      }
    ]
  }
}

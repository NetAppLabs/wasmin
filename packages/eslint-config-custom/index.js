/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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

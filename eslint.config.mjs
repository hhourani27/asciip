import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactApp from "eslint-config-react-app";
import reactAppJest from "eslint-config-react-app/jest";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  ...reactApp,
  ...reactAppJest,
  {
    // Added as it was generating unnecessary errors for playwright tests
    files: ["**/*.spec.ts"],
    rules: {
      "testing-library/prefer-screen-queries": "off",
    },
  },
];

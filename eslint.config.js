// eslint.config.js
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      "jsx-a11y": eslintPluginJsxA11y,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier, // <-- thêm dòng này
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": "error", // Prettier rule
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { fixupPluginRules } from "@eslint/compat";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
// 1. Import Prettier dependencies
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // Global Ignores
  {
    ignores: [".next/*", "node_modules/*"],
  },

  // Base JS & TypeScript Rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React & Next.js Configuration
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": fixupPluginRules(reactHooksPlugin),
      "@next/next": nextPlugin,
      // 2. Register the Prettier plugin
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Standard React/Next Rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Custom Overrides
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      
      // 3. Enable Prettier Rule (Shows red squiggles for formatting)
      "prettier/prettier": "error",
      
      // 4. Turn off rules that might conflict with Prettier manually (optional but recommended)
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },

  // 5. Load Prettier Config LAST to disable any conflicting formatting rules from above
  prettierConfig
);
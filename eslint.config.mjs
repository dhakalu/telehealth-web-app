import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import tseslint from 'typescript-eslint';

import eslint from '@eslint/js';


export default defineConfig([
    {
        ignores: ["**/*.config.js", "build/", "server-build/", ".react-router/"],
    },
    eslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "react": react,
            "react-hooks": eslintPluginReactHooks,
            "jsx-a11y": jsxA11y
        },
        rules: {
            ...eslintPluginReactHooks.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            "jsx-a11y/label-has-associated-control": "off",
            "jsx-a11y/click-events-have-key-events": "off",
            "jsx-a11y/no-noninteractive-element-interactions": "off"
        },
    },

    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,.tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: true, // Required for rules that need type information
                tsconfigRootDir: import.meta.dirname, // Adjust as per your project structure
            },
        },
    }
]);
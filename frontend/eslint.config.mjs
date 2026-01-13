// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import react from "eslint-plugin-react";
import tailwindcss from "eslint-plugin-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/node_modules",
    "**/jest",
    "**/out",
    "**/*.config.js",
    "**/.next/**/*",
    "**/_next/**/*",
    "**/dist/**/*",
    "**/__tmp__/**/*",
    "**/coverage/**/*",
    "**/public/**",
    "**/.storybook/**",
    "**/__mocks__/**",
    "**/.yarn/**",
    "**/test-results/**",
    "**/playwright-report/**",
    "next-env.d.ts",
]), {
    extends: fixupConfigRules(compat.extends(
        "plugin:tailwindcss/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    )),

    plugins: {
        tailwindcss: fixupPluginRules(tailwindcss),
        import: fixupPluginRules(_import),
        react: fixupPluginRules(react),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            typescript: true,
            node: {
                moduleDirectory: ["node_modules", "."],
            },
        },

        tailwindcss: {
            config: "./tailwind.config.js",
        },
    },

    rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-object-type": "warn",

        "tailwindcss/classnames-order": ["warn", {
            officialSorting: true,
        }],

        "tailwindcss/enforces-negative-arbitrary-values": "warn",
        "tailwindcss/enforces-shorthand": "warn",
        "tailwindcss/migration-from-tailwind-2": "warn",
        "tailwindcss/no-custom-classname": "warn",
        "tailwindcss/no-contradicting-classname": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "import/no-named-as-default": 0,
        "jsx-a11y/alt-text": 0,
        "@typescript-eslint/ban-ts-comment": 0,
        "react/jsx-no-literals": "warn",

        "no-restricted-imports": ["error", {
            name: "next/link",
            message: "Please import from `@/i18n/routing` instead.",
        }, {
            name: "next/navigation",
            importNames: ["useRouter", "usePathname"],
            message: "Please import from `@/i18n/routing` instead.",
        }],

        "import/order": ["warn", {
            groups: ["builtin", "external", "internal"],

            pathGroups: [{
                pattern: "react",
                group: "external",
                position: "before",
            }, {
                pattern: "next",
                group: "external",
                position: "before",
            }, {
                pattern: "next/**",
                group: "external",
                position: "before",
            }, {
                pattern: "frontastic",
                group: "internal",
                position: "after",
            }, {
                pattern: "frontastic/**",
                group: "internal",
                position: "after",
            }],

            pathGroupsExcludedImportTypes: ["react"],
            "newlines-between": "never",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],
    },
}, {
    files: ["**/*.spec.{ts,tsx}"],
    extends: [...compat.extends("plugin:jest/recommended")],

    plugins: {
        jest,
    },

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },

    rules: {
        "react/jsx-no-literals": "off",
    },
}, {
    files: ["**/*.stories.{ts,tsx}", "**/storybook/**/*.{ts,tsx}"],

    languageOptions: {
        parserOptions: {
            project: null,
        },
    },

    rules: {
        "react/jsx-no-literals": "off",
    },
}]);
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    require.resolve("@vercel/style-guide/eslint/next"),
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/typescript",
    "plugin:import/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "react-refresh",
    "import",
    "@typescript-eslint",
    "react",
    "prettier",
  ],
  // Ignore these files & folders
  ignorePatterns: [
    "dist",
    "build",
    "**/*.d.ts",
    "postcss.config.js",
    "tailwind.config.ts",
    "next.config.js",
    "tailwind.config.js",
    "env.mjs",
    "node_modules/",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
    react: {
      version: "detect",
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: project,
    tsconfigRootDir: ".",
  },
  // Override rules for specific files & directories
  overrides: [
    {
      files: [
        "**/page.tsx",
        "**/route.ts",
        "**/layout.tsx",
        "**/error.tsx",
        "**/not-found.tsx",
        "**/robots.ts",
        "**/sitemap.ts",
        "**/manifest.ts",
        "./src/emails/**/*.tsx",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
  rules: {
    "prettier/prettier": ["error"],

    // ---------- Custom Rules ----------
    "react/react-in-jsx-scope": "off",
    "no-console": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "max-params": ["error", 3],
    "require-await": "off",
    "no-nested-ternary": "error",
    "react/function-component-definition": "error",
    "react/destructuring-assignment": ["error", "always"],
    "max-depth": ["error", { max: 6 }],
    "react/jsx-max-depth": ["error", { max: 10 }],
    "@typescript-eslint/require-await": "error",
    "@next/next/no-img-element": "off",
    "jsx-a11y/heading-has-content": "off",
    "jsx-a11y/anchor-has-content": "off",
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: ["variable", "function"],
        types: ["function"],
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "variable",
        types: ["boolean", "number", "string", "array"],
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "class",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
      },
      {
        selector: "classMethod",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
    ],
    "react/jsx-sort-props": [
      "error",
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        multiline: "last",
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    "@next/next/no-html-link-for-pages": "off",
    // ---------- Custom Rules End ----------

    // ---------- Import & Sorting Rules ----------
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "type",
          "internal",
          ["parent", "sibling"],
          "object",
          "index",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,
      },
    ],
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/no-named-as-default-member": "off",
    "import/no-default-export": "error",
    "import/extensions": [
      "off",
      "always",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    // ---------- Import & Sorting Rules End ----------
  },
}

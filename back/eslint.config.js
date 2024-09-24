import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    pluginJs.configs.recommended,
    prettier,
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            "prettier/prettier": "error",
        },
        ignores: ["node_modules", "dist"],
    },
];

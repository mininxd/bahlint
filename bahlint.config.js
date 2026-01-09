module.exports = {
    languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        globals: {
            console: "readonly",
            process: "readonly"
        }
    },
    rules: {
        "no-console": "off",
        "no-unused-vars": "warn",
        "no-undef": "warn",
        "no-multiple-empty-lines": ["warn", { max: 1 }],
        "eol-last": ["warn", "always"],
        "no-trailing-spaces": "warn",
        "semi": ["warn", "always"],
        "quotes": ["warn", "double"],
        "prefer-const": ["warn"]
    }
};

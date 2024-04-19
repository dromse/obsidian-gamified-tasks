import tseslint from "typescript-eslint";
const __dirname = import.meta.dirname;

export default tseslint.config(
	// eslint.configs.recommended,
	{
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			},
		},
		files: ["src/**/*.{ts,tsx}"],
		rules: {
			"max-params": "error",
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{ "ts-expect-error": "allow-with-description" },
			],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/array-type": ["error", { default: "generic" }],
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"no-restricted-syntax": [
				"error",
				{
					selector: "TSEnumDeclaration",
					message: "Use const assertion or a string union type instead.",
				},
			],
		},
	},

	{ ignores: ["build/"] },
);

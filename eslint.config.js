import tseslint from "typescript-eslint";
import noInlineStyle from "eslint-plugin-no-inline-styles"
const __dirname = import.meta.dirname;

export default tseslint.config(
	{
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"no-inline-style": noInlineStyle
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			},
		},
		files: ["{src,tests}/**/*.{ts,tsx}"],
		rules: {
			"no-console": "error",
			"no-inline-style/no-inline-styles": 2,
			"no-warning-comments": [
				"error",
				{
					terms: [
						"todo",
						"fix",
						"bug",
						"perf",
						"warn",
						"test",
						"hack",
						"note",
					],
				},
			],
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
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "typeAlias",
					format: ["PascalCase"],
				},
				{
					selector: "variable",
					types: ["boolean"],
					format: ["PascalCase"],
					prefix: ["is", "should", "has", "can", "did", "will"],
				},
				{
					// Generic type parameter must start with letter T, followed by any uppercase letter.
					selector: "typeParameter",
					format: ["PascalCase"],
					// custom: { regex: "^T[A-Z]", match: true },
				},
			],
		},
	},

	{ ignores: ["build/"] },
);

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
const __dirname = import.meta.dirname;

export default tseslint.config(
	// { ignores: ["**/build/**"] },
	eslint.configs.recommended,
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
		rules: {
			// "@typescript-eslint/no-unsafe-argument": "error",
			// "@typescript-eslint/no-unsafe-assignment": "error",
			// "@typescript-eslint/no-unsafe-call": "error",
			// "@typescript-eslint/no-unsafe-member-access": "error",
			// "@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
		},
	},
);

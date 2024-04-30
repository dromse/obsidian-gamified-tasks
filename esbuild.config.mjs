import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import CssModulesPlugin from "esbuild-css-modules-plugin";

const banner = `/*
	DEVELOPMENT VERSION
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	banner: {
		js: prod ? "" : banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	minify: prod ? true : false,
	outfile: "build/main.js",
	plugins: [
		CssModulesPlugin({
			// @see https://github.com/indooorsman/esbuild-css-modules-plugin/blob/main/index.d.ts for more details
			force: true,
			emitDeclarationFile: false,
			localsConvention: "camelCaseOnly",
			namedExports: true,
			inject: false,
		}),
	],
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.rebuild();
	process.exit(0);
}

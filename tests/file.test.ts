import { RawFile } from "@hooks/types";
import { GamifiedTasksSettings } from "@types";
import { getRawFiles } from "@utils/file";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { TFile, Vault } from "obsidian";
const __dirname = import.meta.dirname;

const settings: GamifiedTasksSettings | undefined = undefined;

const vaultPath = "vault/";
const vaultFullPath = path.join(__dirname, vaultPath);

const getMarkdownFiles = (): Array<TFile> => {
	const files: Array<TFile> = [];
	const filePaths = fs.readdirSync(vaultFullPath);

	filePaths.forEach((filePath) => {
		const filePathInVault = path.join(vaultFullPath, filePath);

		if (path.extname(filePathInVault) === ".md") {
			files.push({
				path: filePath,
				basename: path.basename(filePathInVault),
				extension: ".md",
			} as TFile);
		}
	});

	return files;
};

const cachedRead = async (file: TFile): Promise<string> => {
	const fileContent = fs.readFileSync(
		path.join(vaultFullPath, file.path),
		"utf8",
	);

	return fileContent;
};

const vault: Vault = { getMarkdownFiles, cachedRead } as Vault;

describe("Markdown content", () => {
	it("Get file content to parse tasks", async () => {
		const expected: Array<RawFile> = [
			{
				path: "difficulty.md",
				content: [
					"# Tasks with difficulty tags",
					"",
					"## Todo",
					"",
					"- [ ] trivial task #diff/trivial",
					"- [ ] easy task #diff/easy",
					"- [ ] medium task #diff/medium",
					"- [ ] hard task #diff/hard",
					"",
					"## Done",
					"",
					"- [x] trivial task #diff/trivial",
					"- [x] easy task #diff/easy",
					"- [x] medium task #diff/medium",
					"- [x] hard task #diff/hard",
					"",
				],
			},
		];

		const actual = await getRawFiles(vault);

		assert.deepStrictEqual(actual, expected);
	});
});

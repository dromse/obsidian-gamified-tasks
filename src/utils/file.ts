import { RawFile } from "@hooks/types";
import { GrindPluginSettings } from "@types";
import { Vault } from "obsidian";

/** Get array of file lines */
export function getLines(fileContent: string): Array<string> {
	return fileContent.split("\n");
}

/** Get all markdown files in vault with their content */
export async function getRawFiles(
	vault: Vault,
	settings: GrindPluginSettings | undefined,
): Promise<Array<RawFile>> {
	let ignoreList: Array<string> = [];

	if (settings) {
		ignoreList = [...settings.ignoreList];
	}

	const files = Promise.all(
		vault.getMarkdownFiles().map(async (file) => ({
			path: file.path,
			// cachedRead really increased speed of parsing
			content: getLines(await vault.cachedRead(file)),
		})),
	).then((parsedFiles) =>
		parsedFiles.filter((file) => {
			const isIgnoreFile = !ignoreList.some((ignorePattern) =>
				file.path.startsWith(ignorePattern),
			);

			return isIgnoreFile;
		}),
	);

	return files;
}

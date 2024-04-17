/** Split content string by '\n' and return list of strings */
export function getLines(fileContent: string): Array<string> {
	return fileContent.split("\n");
}

export function isDigitString(line: string): boolean {
	const digitLineRegex = /^[+-]?\d*\.?\d+$/;

	return digitLineRegex.test(line);
}

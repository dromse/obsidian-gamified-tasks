export function isDigitString(line: string): boolean {
	const digitLineRegex = /^[+-]?\d*\.?\d+$/;

	return digitLineRegex.test(line);
}

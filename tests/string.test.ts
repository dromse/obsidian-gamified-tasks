import { extractTitlesFromLinks } from "@utils/string";
import assert from "node:assert";
import test, { describe } from "node:test";

describe("String utils", () => {
	describe("Remove links", () => {
		test("Not modify if a line doesn't have links", () => {
			const text = "just simple task";

			const actual = extractTitlesFromLinks(text);

			assert.strictEqual(actual, text);
		});

		test("Remove markdown links", () => {
			const text = "watch [cool video](https://www.youtube.com/watch?v=)";

			const expected = "watch cool video";
			const actual = extractTitlesFromLinks(text);

			assert.strictEqual(actual, expected);
		});

		test("Remove wiki links", () => {
			const text = "check [[Path/to/note|this note]]";

			const expected = "check this note";
			const actual = extractTitlesFromLinks(text);

			assert.strictEqual(actual, expected);
		});

		test("Remove wiki and markdown links in one string", () => {
			const text =
				"watch this [cool video](https://www.youtube.com/watch?v=) and write [[cool note]] or [[Path/to/note|cool note]]";

			const expected =
				"watch this cool video and write cool note or cool note";
			const actual = extractTitlesFromLinks(text);

			assert.strictEqual(actual, expected);
		});
	});
});

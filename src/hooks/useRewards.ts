import { useApp } from "@hooks/useApp";
import { useSettings } from "@hooks/useSettings";
import { isDigitString } from "@utils/check";
import { useEffect, useState } from "react";
import { ParseState } from "@hooks/types";

export type Reward = {
	title: string;
	price: number;
	desc?: string;
	lineNumber: number;
};

export type UseRewardsReturn = {
	rewards: Array<Reward>;
	isRewardsParsed: ParseState;
};

/** Hook for interacting with rewards list */
export default function useRewards(): UseRewardsReturn {
	const [isRewardsParsed, setIsRewardsParsed] =
		useState<ParseState>("parsing");

	const app = useApp();
	const settings = useSettings();

	const [rewards, setRewards] = useState<Array<Reward>>([]);

	if (!app) {
		setIsRewardsParsed("error");

		return { rewards, isRewardsParsed };
	}

	const { vault } = app;

	async function fetchRewards(): Promise<void> {
		if (!settings) {
			return;
		}

		const tFile = vault.getFileByPath(settings.pathToRewards);

		if (!tFile) {
			return;
		}

		const content = await vault.cachedRead(tFile);
		const rewards = parseRewards(content);

		setRewards(rewards);

		setIsRewardsParsed("parsed");
	}

	useEffect(() => {
		fetchRewards();

		vault.on("modify", fetchRewards);
		return () => vault.off("modify", fetchRewards);
	}, []);

	return { rewards, isRewardsParsed };
}

/**
 * Parse rewards from string which represents full file content
 * @param {string} content - full content with `'\n'` delimeters.
 *
 * @example
 * Parse
 * - Line in file: ice cream -> { title: 'ice cream', price: 1 }
 * - Line in file: ice cream | 10 -> { title: 'ice cream', price: 10 }
 * - Line in file: ice cream | 10 | be careful with it -> { title: 'ice cream', price: 10, desc: 'be careful with it' }
 * - Line in file: ice cream | okay be like that -> {title: 'ice cream', price: 1, desc: 'okay be like that' }
 * - Line in file: ice cream | 10 | desc | extra | extra 2 -> { title: 'ice cream', price: 10, desc: 'desc' } <- parses only 3 first elements.
 * - Line in file: ice cream | -> { title: 'ice cream', price: 1 } <- just ignore empty and extra delimeter.
 * Ignore
 * - Line in file: | it's not work -> nothing
 * - Line in file: | -> nothing
 * - Line in file: | 10 -> nothing
 * - Line in file: *empty* -> nothing
 * Feature:
 * - You can use `|` like in Ignore to comment things
 * - Ignore frontmatter enclosed in `---`
 */
function parseRewards(content: string): Array<Reward> {
	const lines = content.split("\n");
	let isInFrontmatter = false;

	const splitedLines = lines.reduce<Array<Array<string>>>((acc, line) => {
		// Check for frontmatter start and end
		if (line.trim() === "---") {
			isInFrontmatter = !isInFrontmatter;
			return acc;
		}

		// Ignore lines in frontmatter or lines that start with `|`
		if (isInFrontmatter || line.trim().startsWith("|")) {
			return acc;
		}

		const newLine = line
			.split("|")
			.map((item) => item.trim())
			.slice(0, 3);

		if (newLine.length > 0 && newLine[0] !== "") {
			acc.push(newLine);
		}

		return acc;
	}, []);

	const rewards = splitedLines.reduce<Array<Reward>>((acc, line, index) => {
		if (line.length === 1) {
			acc.push({
				title: line[0],
				price: 1,
				lineNumber: index,
			});
		} else if (line.length === 2) {
			if (isDigitString(line[1])) {
				acc.push({
					title: line[0],
					price: Number(line[1]),
					lineNumber: index,
				});
			} else {
				acc.push({
					title: line[0],
					price: 1,
					desc: line[1],
					lineNumber: index,
				});
			}
		} else if (line.length === 3) {
			acc.push({
				title: line[0],
				price: Number(line[1]),
				desc: line[2],
				lineNumber: index,
			});
		}
		return acc;
	}, []);

	return rewards;
}

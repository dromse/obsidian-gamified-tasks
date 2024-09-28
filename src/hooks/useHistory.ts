import { useApp } from "@hooks/useApp";
import { useSettings } from "@hooks/useSettings";
import { isDigitString } from "@utils/check";
import { currentDate } from "@utils/date";
import { appendStartAndIgnoreFrontmatter, getFileLines } from "@utils/file";
import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { ParseState } from "@hooks/types";

export type HistoryRow = {
	title: string;
	change: number;
	date: string;
};

export type AddHistoryRowType = {
	change: number;
	title: string;
};

export type UseHistoryReturn = {
	historyRows: Array<HistoryRow>;
	balance: number;
	isHistoryParsed: ParseState;
	addHistoryRow: (newRow: AddHistoryRowType) => Promise<void>;
};

/** Hook for interacting with history list */
export default function useHistory(): UseHistoryReturn {
	const [isHistoryParsed, setIsHistoryParsed] =
		useState<ParseState>("parsing");

	const app = useApp();
	const settings = useSettings();

	const [historyRows, setHistoryRows] = useState<Array<HistoryRow>>([]);
	const [balance, setBalance] = useState(0);
	const [historyFile, setHistoryFile] = useState<TFile>();

	if (!app) {
		setIsHistoryParsed("error");

		return { historyRows, balance, isHistoryParsed, addHistoryRow };
	}

	const { vault } = app;

	/** Add history row on top of file */
	async function addHistoryRow({
		change,
		title,
	}: AddHistoryRowType): Promise<void> {
		const rowStr = `${change} | ${title} | ${currentDate()}\n`;

		if (historyFile) {
			await vault.process(historyFile, (data) =>
				appendStartAndIgnoreFrontmatter(data, rowStr),
			);
			setIsHistoryParsed("parsing");
		}
	}

	async function fetchHistory(): Promise<void> {
		if (settings) {
			const tFile = vault.getFileByPath(settings.pathToHistory);

			if (tFile) {
				const content = await vault.cachedRead(tFile);

				const history = parseHistory(content);
				const balance = calcBalance(history);

				setHistoryFile(tFile);
				setHistoryRows(history);
				setBalance(balance);

				setIsHistoryParsed("parsed");
			}
		}
	}

	useEffect(() => {
		fetchHistory();

		vault.on("modify", fetchHistory);
		return () => vault.off("modify", fetchHistory);
	}, []);

	return { historyRows, balance, isHistoryParsed, addHistoryRow };
}

/** Calculate balance based on history rows and fixed number to 0.00 */
function calcBalance(history: Array<HistoryRow>): number {
	return Number(
		history.reduce((acc, row) => (acc += row.change), 0).toFixed(2),
	);
}

/**
 * Parse history from string which represents full file content
 * @param {string} content - full content with `'\n'` delimeters.
 *
 * @example
 * Parse
 * - Line in file: +1 | do a push up | 2024-01-01 12:00 -> { title: 'do a push up', change: 1, date: "2024-01-01 12:00" }
 */
export function parseHistory(content: string): Array<HistoryRow> {
	const lines = getFileLines(content);

	const splitedLines = lines.reduce<Array<Array<string>>>((acc, line) => {
		const newLine = line
			.split(" | ")
			.map((item) => item.trim())
			.slice(0, 3);

		if (newLine.length > 0 && newLine[0] !== "") {
			acc.push(newLine);
		}

		return acc;
	}, []);

	const history = splitedLines.reduce<Array<HistoryRow>>((acc, line) => {
		if (line.length === 3 && isDigitString(line[0])) {
			acc.push({
				change: Number(line[0]),
				title: line[1],
				date: line[2],
			});
		}

		return acc;
	}, []);

	return history;
}

import { RawFile } from "@hooks/types";
import { getLines } from "@hooks/utils";
import { GrindPluginSettings } from "@types";
import { moment, Vault } from "obsidian";
import { Middleware, Task } from "./types";

/** Cleans task body from founded metadata */
export const cleanBody = (regex: RegExp, task: Task) => {
	const removeWithSpace = new RegExp(regex.source + /\s?/.source);

	const newBody = task.body.replace(removeWithSpace, "").trim();

	return newBody;
};

/** Generate an array of past dates starting from the current date. */
export function generatePastDaysArray(numDays: number) {
	// Get current date
	const currentDate = moment();

	// Initialize an empty array to store the dates
	const datesList = [];

	// Loop through each day from numDays ago to today
	for (let i = 0; i < numDays; i++) {
		const date = currentDate.clone().subtract(i, "days");
		datesList.push(date.format("YYYY-MM-DD"));
	}

	// Reverse the array to get dates in chronological order
	return datesList.reverse();
}

/**
 * Extracts the numeric value from a string representing days or weeks.
 * If the string ends with "day", returns the numeric part as is.
 * If the string ends with "week", returns the numeric part multiplied by 7.
 * If the string does not match the pattern, returns null.
 *
 * @param {string} str - The input string containing a numeric value followed by "day" or "week".
 * @returns The extracted numeric value, or null if no match is found.
 */
export function getAmountOfPastDays(str: string) {
	const regex = /^(\d+)?(day|week)$/;

	const match = str.match(regex);
	if (match) {
		const numericPart = match[1] ? parseInt(match[1]) : 1;
		const isWeek = match[2] === "week";
		return isWeek ? numericPart * 7 : numericPart;
	} else {
		return null;
	}
}

/** Find metadata in a task object  */
export const findByRegex = (regex: RegExp, task: Task) => {
	const match = task.body.match(regex);
	return match;
};

/** Get all markdown files in vault with their content */
export async function getRawFiles(
	vault: Vault,
	settings: GrindPluginSettings | undefined,
): Promise<Array<RawFile>> {
	let ignoreList: string[] = [];

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

/** Parse all occurance of task line in `file` content and then returns task list */
export function parseTasksFromFile(file: RawFile): Array<Task> {
	const tasks = file.content.reduce<Array<Task>>((acc, lineContent, index) => {
		const regex = /- \[.\]/;

		if (lineContent.match(regex)) {
			acc.push({
				path: file.path,
				lineContent,
				lineNumber: index,
				body: lineContent,
			});
		}

		return acc;
	}, []);

	return tasks;
}

/** Iterates through all files, parse tasks from files and return all found tasks in `files`
 * @param {RawFile[]} files - list of RawFile[]
 *
 * @returns {Task[]} all tasks in files
 *
 * @example
 * const files = [{ tFile: {...}: TFile, content: ['- [ ] one simple task'] }]
 *
 * const tasks = parseTasks(files)
 * -> [{ tFile: {...}, completed: false, lineNumber: 0, lineContent: '- [ ] one simple task', body: '- [ ] one simple task' }]
 */
export function parseTasks(files: Array<RawFile>): Array<Task> {
	const tasks = files.reduce(
		(acc, file) => [...acc, ...parseTasksFromFile(file)],
		[],
	);

	return tasks;
}

/** Stringify task obj by middlewares */
export function stringifyMiddlewares(
	task: Task,
	middlewares: Array<Middleware>,
	settings: GrindPluginSettings | undefined,
): string {
	const taskString = middlewares.reduce(
		(str, middleware) => (str += middleware.stringify(task, settings)),
		"",
	);

	return taskString;
}

/** Iterate through all tasks and parse their middlewares and return new task list  */
export function parseMiddlewares(
	tasks: Array<Task>,
	middlewares: Array<Middleware>,
	settings: GrindPluginSettings | undefined,
): Task[] {
	middlewares.forEach(
		(middleware) =>
			(tasks = tasks.map((task) => middleware.parse(task, settings))),
	);

	return tasks;
}

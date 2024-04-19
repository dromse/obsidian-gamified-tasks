import { RawFile } from "@hooks/types";
import { Task } from "@hooks/useTasks/types";

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

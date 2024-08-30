import { Middleware, Task } from "@hooks/useTasks/types";
import { GamifiedTasksSettings } from "@types";
import { App } from "obsidian";

/** Stringify task obj by middlewares */
export function stringifyMiddlewares(
	task: Task,
	middlewares: Array<Middleware>,
	settings: GamifiedTasksSettings | undefined,
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
	additional: {
		settings: GamifiedTasksSettings | undefined;
		app: App | undefined;
	},
): Array<Task> {
	middlewares.forEach(
		(middleware) =>
			(tasks = tasks.map((task) => middleware.parse(task, additional.settings, additional.app))),
	);

	return tasks;
}

/** Cleans task body from founded metadata */
export const cleanBody = (regex: RegExp, task: Task): string => {
	const removeWithSpace = new RegExp(regex.source + /\s?/.source);

	const newBody = task.body.replace(removeWithSpace, "").trim();

	return newBody;
};

/** Find metadata in a task object  */
export const findByRegex = (
	regex: RegExp,
	task: Task,
): RegExpMatchArray | null => {
	const match = task.body.match(regex);
	return match;
};

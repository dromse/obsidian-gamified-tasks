import { GamifiedTasksSettings } from "@types";
import { cleanBody, findByRegex } from "@utils/middleware";
import { Middleware, Task } from "../../hooks/useWatchTasks/types";

const parse = (task: Task, settings: GamifiedTasksSettings): Task => {
	const difficultyListForRegex = settings.difficulties.reduce<Array<string>>(
		(acc, diff) => {
			acc.push(diff.name);
			return acc;
		},
		[],
	);

	const regex = new RegExp(`#diff/(${difficultyListForRegex.join("|")})`);

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	return { ...task, difficulty: match[1], body: newBody };
};

const stringify = (task: Task): string =>
	task.difficulty ? ` #diff/${task.difficulty}` : "";

export default { parse, stringify } as Middleware;

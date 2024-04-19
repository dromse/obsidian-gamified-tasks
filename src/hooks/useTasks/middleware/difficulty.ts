import { DifficultyKeys } from "../consts";
import { Difficulty, Middleware, Task } from "../types";
import { cleanBody, findByRegex } from "@utils/middleware";

const parse = (task: Task): Task => {
	const regex = new RegExp(`#diff/(${DifficultyKeys.join("|")})`);

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	return { ...task, difficulty: match[1] as Difficulty, body: newBody };
};

const stringify = (task: Task): string =>
	task.difficulty ? ` #diff/${task.difficulty}` : "";

export default { parse, stringify } as Middleware;

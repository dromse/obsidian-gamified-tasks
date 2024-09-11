import { StatusKeys, StatusMarkdown } from "../../hooks/useWatchTasks/consts";
import { Middleware, Status, Task } from "../../hooks/useWatchTasks/types";
import { cleanBody, findByRegex } from "@utils/middleware";

const parse = (task: Task): Task => {
	const regex = /- \[(.)\]/;

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	const status = StatusKeys.find(
		(key) => StatusMarkdown[key as Status] === match[1],
	);

	return { ...task, status, body: newBody } as Task;
};

const stringify = (task: Task): string =>
	task.status ? `- [${StatusMarkdown[task.status]}]` : "";

export default { parse, stringify } as Middleware;

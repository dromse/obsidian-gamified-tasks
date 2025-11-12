import { Middleware, Status, Task } from "../types";
import { cleanBody, findByRegex } from "@utils/middleware";
import { StatusKeys, StatusMarkdown } from "@core/consts";

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

const stringify = (task: Task): string => {
	if (task.status === 'archive') {
		return `- ${StatusMarkdown[task.status]}`
	}

	if (task.status) {
		return `- [${StatusMarkdown[task.status]}]`
	}

	return ""
}

export default { parse, stringify } as Middleware;

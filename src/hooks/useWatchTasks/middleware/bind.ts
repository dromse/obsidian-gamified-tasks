import { cleanBody, findByRegex } from "@utils/middleware";
import { Middleware, Task } from "../types";

const parse = (task: Task): Task => {
	const regex = /#bind\/(\w+)/;

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const bind = match[1]; // Capture the bind

	const newBody = cleanBody(regex, task);

	return { ...task, bind, body: newBody };
};

const stringify = (task: Task): string =>
	task.bind ? ` #bind/${task.bind}` : "";

const middleware: Middleware = {
	parse,
	stringify,
};

export default middleware;

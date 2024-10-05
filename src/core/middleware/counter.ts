import { cleanBody, findByRegex } from "@utils/middleware";
import { Middleware, Task } from "../types";

const parse = (task: Task): Task => {
	const regex = /#count\/(-?\d+)\/?(-?\d+)?/;

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	return {
		...task,
		counter: {
			current: Number(match[1]),
			goal: match[2] ? Number(match[2]) : undefined,
		},
		body: newBody,
	};
};

const stringify = (task: Task): string =>
	task.counter
		? ` #count/${task.counter.current}${task.counter.goal ? "/" + task.counter.goal : ""}`
		: "";

export default { parse, stringify } as Middleware;

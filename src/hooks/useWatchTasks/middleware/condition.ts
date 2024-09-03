import { GamifiedTasksSettings } from "@types";
import { cleanBody, findByRegex } from "@utils/middleware";
import { App } from "obsidian";
import { Middleware, Task } from "../types";

const parse = (
	task: Task,
	settings: GamifiedTasksSettings,
	app: App,
): Task => {
	const regex = /#if\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]*))?/;

	const match = findByRegex(regex, task);

	if (!match) {
		return task;
	}

	const newBody = cleanBody(regex, task);

	const conditionName = match[1];
	const pathToFile = settings.pathToConditions + conditionName + ".js";
	const resourcePath = app.vault.adapter.getResourcePath(pathToFile);

	const condition = {
		name: conditionName,
		file: resourcePath,
		arg: match[2] ? match[2] : "",
	};

	return { ...task, condition, body: newBody };
};

const stringify = (task: Task, settings: GamifiedTasksSettings): string => {
	let ifTag = "";

	if (task.condition) {
		ifTag = ` #if/${task.condition.name}${task.condition.arg ? "/" + task.condition.arg : ""}`;
	}

	return ifTag;
};

export default { parse, stringify } as Middleware;
